import Tools from "../util/Tools";

const parseTimeMixin = {
  data() {
    return {
      txListTimer: null
    }
  },
  methods: {
    /**
     * @description: parse Age
     * @param {*} txLists need to parse list or lists
     * @param {*} key origin key
     * @param {*} parsedKey parsedKey
     * @return {*} null
     */
    parseTime(txList = [], key, parsedKey) {
      clearInterval(this.txListTimer);
      this.txListTimer = setInterval(() => {
        txList.forEach(item => {
          if (Array.isArray(item)) {
            item.forEach(subItem => {
              subItem[parsedKey] = Tools.formatAge(
                Tools.getTimestamp(),
                subItem[key] * 1000,
                this.$t('ExplorerLang.table.suffix')
              )
            })
          } else {
            item[parsedKey] = Tools.formatAge(
              Tools.getTimestamp(),
              item[key] * 1000,
              this.$t('ExplorerLang.table.suffix')
            )
          }
        })
      }, 1000);
    },
  },
  beforeDestroy() {
    clearInterval(this.txListTimer);
  },
};


export default parseTimeMixin
