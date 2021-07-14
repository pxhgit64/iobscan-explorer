import Tools from "../util/Tools";

var parseTimeMixin = {
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
     * @param {*} mutiple txLists is or not mutiple list set
     * @return {*} null
     */
    parseTime(txLists, key, parsedKey, mutiple) {
      clearInterval(this.txListTimer);
      this.txListTimer = setInterval(() => {
        if (mutiple) {
          txLists.map(txList => {
            txList.map((item) => {
              item[parsedKey] = Tools.formatAge(
                Tools.getTimestamp(),
                item[key] * 1000,
                "ago"
              );
              return item;
            });
          })
        } else {
          txLists.map((item) => {
            item[parsedKey] = Tools.formatAge(
              Tools.getTimestamp(),
              item[key] * 1000,
              "ago"
            );
            return item;
          });
        }
      }, 1000);
    },
  },
  beforeDestroy() {
    clearInterval(this.txListTimer);
  },
};


export default parseTimeMixin
