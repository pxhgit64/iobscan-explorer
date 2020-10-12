import moment from 'moment'
import BigNumber from 'bignumber.js'
import URLSearchParams from 'url-search-params'
import bech32 from 'bech32'
import moveDecimal from 'move-decimal-point'
import Constant from '../constant/index.js'
import productionConfig from '@/productionConfig.js'
export default class Tools {
  /**
   * 根据展示的需求拼接字符串展示成 > xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs ago 或者 xxdxxhxxmxxs
   */
  static formatAge(currentServerTime, time, suffix, prefix) {
    let dateBegin = new Date(time)
    let dateDiff = currentServerTime - dateBegin.getTime() / 1000
    if (dateDiff < 0) {
      return ''
    }
    //console.log('----',dateBegin.getTime())
    let dayDiff = Math.floor(dateDiff / (24 * 3600))
    let hourLevel = dateDiff % (24 * 3600)
    let hours = Math.floor(hourLevel / 3600)
    let minuteLevel = dateDiff % 3600
    let minutes = Math.floor(minuteLevel / 60)
    let seconds = dateDiff % 60

    let str = `${dayDiff ? `${dayDiff}d` : ''} ${hours ? `${hours}h` : ''} ${dayDiff && hours ? '' : minutes ? `${minutes}m` : ''} ${dayDiff || hours || minutes ? '' : seconds ? `${seconds}s` : ''}`
    if (prefix && suffix) {
      return `${prefix} ${str} ${suffix}`
    } else if (suffix) {
      return `${str} ${suffix}`
    } else {
      return `${str}`
    }
  }

  /**
   * 格式化地址
   */
  static formatValidatorAddress(address) {
    return Tools.format38(address)
  }

  /**
   * 前三后八格式
   */
  static format38(str) {
    if (str && str.length > 11) {
      return `${str.substring(0, 3)}...${str.substring(str.length - 8)}`
    } else if (str && str.length < 11) {
      return str
    }
    return ''
  }

  /**
   * 格式化空格
   */
  static removeAllSpace(str) {
    return str.replace(/\s+/g, '')
  }

  /**
   * 首字母大写
   * */
  static firstWordUpperCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toUpperCase()
    })
  }
  /**
   * 转换时间格式
   * */
  static getDisplayDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(timestamp * 1000)
      .utcOffset(+480)
      .format(format)
  }

  static getFormatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date)
      .utcOffset(+480)
      .format(format)
  }

  static getTimestamp() {
    return Math.floor(new Date().getTime() / 1000)
  }

  static urlParser(url = document.location.toString()) {
    if (url.includes('?')) {
      const searchStr = url.split('?')[1]
      let searchInstance = new URLSearchParams(searchStr)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else if (url.includes('&')) {
      let searchInstance = new URLSearchParams(url)
      let params = {}
      for (let entries of searchInstance.entries()) {
        params[entries[0]] = entries[1]
      }
      return params
    } else {
      return {}
    }
  }

  static isBech32(str) {
    let allReg = new RegExp(/^[0-9a-zA-Z]*$/i)
    if (!allReg.test(str)) {
      return false
    }

    try {
      bech32.decode(str)
      return true
    } catch (e) {
      return false
    }
  }

  static isValid(value) {
    return !value || !value.length || value == '--' ? false : true
  }
  /**
   * 根据字节截取字符串
   */
  static formatString(string, cutOutlength, addSuffix) {
    let stringLength = string.replace(/[^\x00-\xff]/g, '**').length
    if (stringLength > cutOutlength) {
      if (!addSuffix) {
        addSuffix = '......'
      }
      var bytesLength = 0
      var unitStringUnicodeMaxlength = 255
      for (var index = 0; index < cutOutlength; index++) {
        if (string.charCodeAt(index) > unitStringUnicodeMaxlength) {
          bytesLength = bytesLength + 2
        } else {
          bytesLength = bytesLength + 1
        }
        if (bytesLength >= cutOutlength) {
          string = string.slice(0, index + 1) + addSuffix
          break
        }
      }
      return string
    } else {
      return string + ''
    }
  }
  static formatPriceToFixed(value, fixedValue) {
    return new BigNumber(value).toFormat(fixedValue)
  }
  // 转化uptime的方法
  static FormatUptime(number) {
    return `${(number * 100).toFixed(4)}%`
  }
  static subStrings(value, afterPointLength) {
    //截取指定小数位长度字符串
    if (value) {
      let arr = value.split('.')
      arr[1] = arr[1] || ''
      if (arr[1].toString().length > afterPointLength) {
        value = `${arr[0]}.${arr[1].substring(0, afterPointLength)}`
      } else {
        let diffNum = afterPointLength - arr[1].toString().length
        for (let i = 0; i < diffNum; i++) {
          arr[1] += '0'
        }
        value = `${arr[0]}.${arr[1]}`
      }
      // value = `${arr[0]}.${arr[1].padEnd(afterPointLength, '0').substring(0, afterPointLength)}`;
    }
    return value
  }
  /**
   * 后端返回的数据转换成标准格式
   */
  static format2UTC(originTime) {
    return `${originTime.substr(0, 4)}-${originTime.substr(5, 2)}-${originTime.substr(8, 2)} ${originTime.substr(11, 8)}`
  }
  /**
   * 格式化数字类型是string的数字并让小数点左移18位 (本质是移动小数点的位置)
   *
   */
  static numberMoveDecimal(number) {
    let leftLength = -18
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(new BigNumber(number).toFixed().toString(), leftLength)
      } else {
        return moveDecimal(new BigNumber(number).toFixed().toString() + '.', leftLength)
      }
    } else {
      if (number.toString().indexOf('e') !== -1) {
        return moveDecimal(number.toString(), leftLength)
      } else {
        return moveDecimal(number.toString() + '.', leftLength)
      }
    }
  }
  static formatDenom(denom) {
    if (denom.toLowerCase() === 'iris-atto' || denom.toLowerCase() === 'iris') {
      return 'IRIS'
    } else {
      return denom
    }
  }
  /**
   *   科学计数法转成数字
   *
   * */
  static FormatScientificNotationToNumber(number) {
    let formattedNumber
    if (number.toString().indexOf('e') !== -1 || number.toString().indexOf('E') !== -1) {
      formattedNumber = new BigNumber(number).toFixed().toString()
    } else {
      formattedNumber = number
    }
    return formattedNumber
  }

  static formatTxList(list, txType) {
    if (list !== null) {
      return list.map(item => {
        let [Amount, Fee, transferAmount, transferFee, tokenId] = ['--', '--', '--', '--', '--']
        let commonHeaderObjList, objList, commonFooterObjList
        let formatListAmount, fromInformation, toInformation
        formatListAmount = Tools.formatListAmount(item).amount
        fromInformation = Tools.formatListAmount(item).fromAddressAndMoniker
        toInformation = Tools.formatListAmount(item).toAddressAndMoniker
        Amount = formatListAmount.amountNumber === '--' || formatListAmount.tokenName === '--' ? '--' : `${Tools.formatStringToFixedNumber(new BigNumber(formatListAmount.amountNumber).toFormat(), 2)} ${formatListAmount.tokenName}`
        transferAmount = formatListAmount.amountNumber === '--' ? '--' : Tools.formatStringToFixedNumber(new BigNumber(formatListAmount.amountNumber).toFormat(), 2)
        tokenId = formatListAmount.tokenName === '--' ? '--' : formatListAmount.tokenName
        if (item.fee.amount && item.fee.denom) {
          let feeAmount = item.fee.amount
          transferFee = `${Tools.formatStringToFixedNumber(String(Tools.formatNumber(feeAmount)), 6)}`
          Fee = `${Tools.formatStringToFixedNumber(String(Tools.formatNumber(feeAmount)), 6)} ${Tools.formatDenom(item.fee.denom).toUpperCase()}`
        }
        commonHeaderObjList = {
          Tx_Hash: item.hash,
          Block: item.block_height,
        }
        commonFooterObjList = {
          Tx_Type: item.type,
          Tx_Fee: Fee,
          Tx_Signer: item.signer ? item.signer : '',
          Tx_Status: Tools.firstWordUpperCase(item.status),
          Timestamp: Tools.format2UTC(item.timestamp),
        }
        if (txType === 'transfers') {
          objList = {
            From: fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].address : '--',
            Amount: transferAmount,
            transferFee: transferFee,
            tokenId,
            fromMoniker: fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].moniker : '',
            toMoniker: toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].moniker : '',
            To: toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].address : '--',
            listName: 'transfer',
          }
        } else if (txType === 'validations') {
          let Moniker = []
          if (item.monikers && JSON.stringify(item.monikers) !== '{}') {
            for (let value in item.monikers) {
              if (value === item.operator_addr) {
                Moniker.unshift(item.monikers[item.operator_addr])
              }
            }
          }
          objList = {
            Moniker: Moniker.length === 1 ? Tools.formatString(Moniker[0], 15, '...') : '--',
            Amount,
            OperatorAddr: item.operator_addr ? item.operator_addr : '--',
            listName: 'validations',
            Self_Bonded: item.self_bonded,
          }
        } else if (txType === 'delegations') {
          objList = {
            From: fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].address : '--',
            Amount,
            To: toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].address : '--',
            listName: 'delegations',
            fromMoniker: fromInformation.length > 1 ? fromInformation.length : fromInformation.length === 1 ? fromInformation[0].moniker : '',
            toMoniker: toInformation.length > 1 ? toInformation.length : toInformation.length === 1 ? toInformation[0].moniker : '',
          }
        } else if (txType === 'governance') {
          objList = {
            Proposal_Type: item.proposal_type ? item.proposal_type : '--',
            Proposal_ID: item.proposal_id === 0 ? '--' : item.proposal_id,
            Proposal_Title: item.title ? Tools.formatString(item.title, 15, '...') : '--',
            Amount,
            Tx_Type: item.type,
            Tx_Fee: '',
            listName: 'gov',
          }
        }
        let allObjList = Object.assign(commonHeaderObjList, objList, commonFooterObjList)
        return allObjList
      })
    } else {
      let noObjList
      if (txType === 'transfers') {
        noObjList = [
          {
            Tx_Hash: '',
            Block: '',
            From: '',
            Amount: '',
            To: '',
            Tx_Type: '',
            Tx_Fee: '',
            Tx_Signer: '',
            Tx_Status: '',
            Timestamp: '',
            listName: 'transfer',
          },
        ]
      } else if (txType === 'declarations') {
        noObjList = [
          {
            Tx_Hash: '',
            Block: '',
            Moniker: '',
            OperatorAddr: '',
            From: '',
            Amount: '',
            To: '',
            Tx_Type: '',
            Tx_Fee: '',
            Tx_Signer: '',
            Tx_Status: '',
            Timestamp: '',
            listName: 'declarations',
          },
        ]
      } else if (txType === 'stakes') {
        noObjList = [
          {
            TxHash: '',
            Block: '',
            From: '',
            Amount: '',
            To: '',
            Tx_Type: '',
            Tx_Fee: '',
            Tx_Signer: '',
            Tx_Status: '',
            Timestamp: '',
            listName: 'stakes',
          },
        ]
      } else if (txType === 'governance') {
        noObjList = []
      }
      return noObjList
    }
  }

  /**
   * 交易列表Amount方法重构(data -> 后端返回数据的结构)
   * */
  static formatListAmount(data) {
    let amount,
      fromAddressAndMoniker = [],
      toAddressAndMoniker = []
    if (data && data.type) {
      switch (data.type) {
        case Constant.TxType.TRANSFER:
          amount = Tools.formatListByAmount(data.amount)
          if (data.msgs) {
            data.msgs.forEach(item => {
              if (item.msg) {
                item.msg.inputs.forEach(item => {
                  fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.address, data.monikers))
                })
                item.msg.outputs.forEach(item => {
                  toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.address, data.monikers))
                })
              }
            })
          }
          break
        case Constant.TxType.BURN:
          amount = Tools.formatListByAmount(data.amount)
          if (data.msgs) {
            data.msgs.forEach(item => {
              if (item.msg) {
                fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.owner, data.monikers))
              }
            })
          }
          break
        case Constant.TxType.SETMEMOREGEXP:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.CREATEVALIDATOR:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.EDITVALIDATOR:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.UNJAIL:
          amount = Tools.formatListByAmount(data.amount)

          break
        case Constant.TxType.DELEGATE:
          amount = Tools.formatListByAmount(data.amount)
          if (data.msgs) {
            data.msgs.forEach(item => {
              if (item.msg) {
                fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.delegator_addr, data.monikers))
                toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.validator_addr, data.monikers))
              }
            })
          }
          break
        case Constant.TxType.BEGINREDELEGATE:
          amount = Tools.formatListByTagsBalance(data.tags)
          if (data.status === 'success') {
            if (data.tags) {
              fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags['source-validator'], data.monikers))
              toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags['destination-validator'], data.monikers))
            }
          } else {
            if (data.msgs) {
              data.msgs.forEach(item => {
                if (item.msg) {
                  fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.validator_src_addr, data.monikers))
                  toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.validator_dst_addr, data.monikers))
                }
              })
            }
          }
          break
        case Constant.TxType.SETWITHDRAWADDRESS:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.BEGINUNBONDING:
          amount = Tools.formatListByTagsBalance(data.tags)
          if (data.status === 'success') {
            if (data.tags) {
              fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags['source-validator'], data.monikers))
              toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags['delegator'], data.monikers))
            }
          } else {
            if (data.msgs) {
              data.msgs.forEach(item => {
                if (item.msg) {
                  fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.validator_addr, data.monikers))
                  toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.delegator_addr, data.monikers))
                }
              })
            }
          }
          break
        case Constant.TxType.WITHDRAWDELEGATORREWARD:
          amount = Tools.formatListByAmount(data.amount)
          if (data.msgs) {
            data.msgs.forEach(item => {
              if (item.msg) {
                fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.validator_addr, data.monikers))
                toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.delegator_addr, data.monikers))
              }
            })
          }

          break
        case Constant.TxType.WITHDRAWDELEGATORREWARDSALL:
          amount = Tools.formatListByAmount(data.amount)
          let fromAddressArray = [],
            toAddressArray = []
          if (data.status === 'success') {
            if (data.tags) {
              for (let item in data.tags) {
                if (item.startsWith('withdraw-reward-from-validator')) {
                  fromAddressArray.push(item.split('-')[item.split('-').length - 1])
                }
                if (item === 'delegator') {
                  toAddressArray.push(data.tags[item])
                }
              }
            }
          } else {
            if (data.msgs) {
              data.msgs.forEach(item => {
                if (item.msg) {
                  if (item.msg.validator_addr) {
                    fromAddressArray.unshift(item.msg.validator_addr)
                  }
                  if (item.msg.delegator_addr) {
                    toAddressArray.unshift(item.msg.delegator_addr)
                  }
                }
              })
            }
          }
          fromAddressArray.forEach(item => {
            fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item, data.monikers))
          })
          toAddressArray.forEach(item => {
            toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item, data.monikers))
          })
          break
        case Constant.TxType.WITHDRAWVALIDATORREWARDSALL:
          amount = Tools.formatListByAmount(data.amount)
          let withDrawValidatorFromAddressArray = [],
            withDrawValidatorToAddressArray = []
          if (data.tags) {
            for (let item in data.tags) {
              if (item.startsWith('withdraw-reward-from-validator')) {
                withDrawValidatorFromAddressArray.push(item.split('-')[item.split('-').length - 1])
              }
              if (item === 'withdraw-address') {
                withDrawValidatorToAddressArray.push(data.tags[item])
              }
            }
          }
          withDrawValidatorFromAddressArray.forEach(item => {
            fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item, data.monikers))
          })
          withDrawValidatorToAddressArray.forEach(item => {
            toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item, data.monikers))
          })
          break
        case Constant.TxType.SUBMITPROPOSAL:
          fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.signer, data.monikers))
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.DEPOSIT:
          fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.signer, data.monikers))
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.VOTE:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.ISSUETOKEN:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.EDITTOKEN:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.MINTTOKEN:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.TRANSFERTOKENOWNER:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.CREATEGATEWAY:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.EDITGATEWAY:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.TRANSFERGATEWAYOWNER:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.REQUESTRAND:
          amount = Tools.formatListByAmount(data.amount)
          break
        case Constant.TxType.CLAIMHTLC:
          if (data.status === 'success') {
            if (data.tags) {
              fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags.sender, data.monikers))
              toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags.receiver, data.monikers))
            }
          }
          break
        case Constant.TxType.REFUNDHTLC:
          if (data.tags && data.tags.sender) {
            toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(data.tags.sender, data.monikers))
          }
          break
        case Constant.TxType.CREATEHTLC:
          if (data.msgs) {
            data.msgs.forEach(item => {
              if (item.msg) {
                fromAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.sender, data.monikers))
                toAddressAndMoniker.unshift(Tools.getFromAndToMoniker(item.msg.to, data.monikers))
              }
            })
          }
      }
    }
    return {
      amount,
      fromAddressAndMoniker,
      toAddressAndMoniker,
    }
  }

  /**
   * 从amount字段中获取amount
   * */
  static formatListByAmount(amount) {
    let [amountNumber, tokenName] = ['--', '--']
    if (amount instanceof Array && amount.length > 0) {
      if (amount.length > 1) {
        amountNumber = `${amount.length} Tokens`
        tokenName = '--'
      } else {
        if ((amount[0].denom && amount[0].amount && amount[0].denom === Constant.Denom.IRISATTO) || amount[0].amount == 0) {
          amountNumber = amount[0].amount > 0 ? Tools.formatStringToFixedNumber(String(Tools.numberMoveDecimal(amount[0].amount)), 2) : Number(amount[0].amount).toFixed(2)
          tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
        } else if (amount[0].denom && amount[0].amount && amount[0].denom !== Constant.Denom.IRISATTO) {
          amountNumber = amount[0].amount
          tokenName = amount[0].denom.toLocaleUpperCase()
        } else {
          amountNumber = Tools.formatStringToFixedNumber(Tools.FormatScientificNotationToNumber(amount[0].amount), 2)
          if (amount[0].denom === Constant.Denom.IRISATTO) {
            tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
          } else {
            tokenName = amount[0].denom ? amount[0].denom.toLocaleUpperCase() : '--'
          }
        }
      }
    } else if (amount.amount && Object.keys(amount.amount).includes('amount') && Object.keys(amount.amount).includes('denom')) {
      if (amount.denom === Constant.Denom.IRISATTO) {
        amountNumber = Tools.formatStringToFixedNumber(String(Tools.numberMoveDecimal(amount.amount)), 2)
        tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
      } else if (amount.denom !== Constant.Denom.IRISATTO) {
        amountNumber = amount.amount
        tokenName = amount.denom.toLocaleUpperCase()
      } else if (!amount.denom) {
        amountNumber = amount.amount
        tokenName = ''
      }
    } else if (amount && Object.keys(amount).includes('amount') && Object.keys(amount).includes('denom')) {
      if (amount.denom === Constant.Denom.IRISATTO) {
        amountNumber = Tools.formatStringToFixedNumber(String(Tools.numberMoveDecimal(amount.amount)), 2)
        tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
      } else if (amount.denom !== Constant.Denom.IRISATTO) {
        amountNumber = amount.amount
        tokenName = amount.denom.toLocaleUpperCase()
      } else if (!amount.denom) {
        amountNumber = amount.amount
        tokenName = ''
      }
    }
    // console.log(amountNumber,tokenName,"amount information")
    return { amountNumber, tokenName }
  }

  /**
   * 格式化数字的类型是string的数字并在小数点后面补零
   */
  static formatStringToFixedNumber(str, splitNum) {
    if (str.toString().indexOf('.') !== -1) {
      let splitString = str.split('.')[1]
      if (splitString.length > splitNum) {
        return str.split('.')[0] + '.' + splitString.substr(0, splitNum)
      } else {
        let diffNum = 2 - splitString.length
        for (let i = 0; i < diffNum; i++) {
          splitString += '0'
        }
        return str.split('.')[0] + '.' + splitString
      }
    } else {
      return str + '.00'
    }
  }
  /**
   * Form和To字段展示的问题
   * */
  static getFromAndToMoniker(address, monikers) {
    let resData = {
      address: address,
      moniker: monikers[address] ? monikers[address] : '',
    }

    return resData
  }
  /**
   * 格式化数字（除以10的18次方）
   * */
  static formatNumber(num) {
    return new BigNumber(num).div(1000000000000000000).toNumber()
  }

  /**
   * format txHash
   * param String
   * return String
   */
  static formatTxHash(txHash) {
    return `${txHash.substring(0, 3)}...${txHash.substring(txHash.length - 3)}`
  }
  /**
   * 从tags中的balance获取amount
   * */
  static formatListByTagsBalance(tags, flSplitNum) {
    let [amountNumber, tokenName] = ['--', '--']
    if (tags && tags.balance) {
      let tokenValue = Tools.formatAccountCoinsAmount(tags.balance)
      let tokenStr = String(Tools.numberMoveDecimal(tokenValue[0], 18))
      if (flSplitNum) {
        amountNumber = tokenStr
      } else {
        amountNumber = Tools.formatStringToFixedNumber(tokenStr, 2)
      }
      tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
    }
    return { amountNumber, tokenName }
  }
  /**
   * 获取水龙头Amount
   * param ['11.1111iris']
   * return ['11.1111']
   */
  static formatAccountCoinsAmount(coinsAmount) {
    return (coinsAmount = /[0-9]+[.]?[0-9]*/.exec(coinsAmount))
  }
  static formatAccountCoinsDenom(coinsDenom){
    return coinsDenom = /[A-Za-z\-]{2,15}/.exec(coinsDenom)
  }
  /**
   *   formatAmount
   *   param Object or array
   *   return string
   *   fixedNumber: nonzero
   * */
  static formatAmount2(param, fixedNumber) {
    let amount, amountDenom, amountNumber, amountRadixNumber
    if (param instanceof Array) {
      amount = param[0].amount
      amountDenom = param[0].denom
    } else if (param instanceof Object) {
      amount = param.amount
      amountDenom = param.denom
    }
    if (amount.toString().indexOf('e') !== -1 || amount.toString().indexOf('E') !== -1) {
      if (amount.toString().indexOf('.') !== -1) {
        amountNumber = new BigNumber(amount).toFixed().toString()
      } else {
        amountNumber = new BigNumber(amount).toFixed().toString() + '.'
      }
      amountRadixNumber = Tools.amountRadix(amountDenom)
    } else {
      if (amount.toString().indexOf('.') !== -1) {
        amountNumber = amount.toString()
      } else {
        amountNumber = amount.toString() + '.'
      }
      amountRadixNumber = Tools.amountRadix(amountDenom)
    }
    if (amountDenom) {
      return `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(amountNumber, Number(amountRadixNumber) * -1)).toFormat(), fixedNumber)} ${Constant.RADIXDENOM.IRIS.toLocaleUpperCase()}`
    } else {
      return `${Tools.formatStringToFixedNumber(new BigNumber(moveDecimal(amountNumber, Number(amountRadixNumber) * -1)).toFormat(), fixedNumber)} SHARES`
    }
  }
  /**
   *   Amount iris Radix
   *   param string
   *   return Radix length
   * */
  static amountRadix(param) {
    let diffValue = 1,
      defaultValue = 18
    if (param) {
      //radix number length need to minus 1;
      switch (param) {
        case Constant.RADIXDENOM.IRISATTO:
          return Constant.RADIXDENOM.IRISATTONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISMILLI:
          return Constant.RADIXDENOM.IRISMILLINUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISMICRO:
          return Constant.RADIXDENOM.IRISMICRONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISNANO:
          return Constant.RADIXDENOM.IRISNANONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISPICO:
          return Constant.RADIXDENOM.IRISPICONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRISFEMTO:
          return Constant.RADIXDENOM.IRISFEMTONUMBER.length - diffValue
          break
        case Constant.RADIXDENOM.IRIS:
          return Constant.RADIXDENOM.IRISNUMBER.length - diffValue
          break
        default:
          return defaultValue
      }
    } else {
      return defaultValue
    }
  }
  static firstWordLowerCase(str) {
    return str.toLowerCase().replace(/(\s|^)[a-z]/g, function(char) {
      return char.toLocaleLowerCase()
    })
  }
  /**
   * 判断当前是移动端还是pc端
   */
  static currentDeviceIsPersonComputer() {
    const userAgentInfo = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let i = 0; i < Agents.length; i++) {
      if (userAgentInfo.includes(Agents[i]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }
  /**
   * 格式化数字（除以10的18次方）
   * */
  static formaNumberAboutGasPrice(num) {
    return new BigNumber(num).div(1000000000).toNumber()
  }

  static convertScientificNotation2Number(num) {
    return new BigNumber(num).toFixed()
  }

  /**
   * 格式化fee
   * */
  static formatFee(Fee) {
    if (Fee.amount && Fee.denom) {
      return `${Tools.formatStringToFixedNumber(String(Tools.formatNumber(Fee.amount)), 4)} ${Tools.formatDenom(Fee.denom).toUpperCase()}`
    }
  }

  /**
   * 格式化交易详情页的amount
   * */
  static formatAmountOfTxDetail(amount) {
    let [amountNumber, tokenName, moreAmountsNumber] = ['--', '--', []]
    if (amount instanceof Array && amount.length > 0) {
      if (amount.length !== 1) {
        moreAmountsNumber = amount.map(item => {
          if (item.denom === Constant.Denom.IRISATTO) {
            return {
              denom: Constant.Denom.IRIS.toLocaleUpperCase(),
              amount: String(Tools.numberMoveDecimal(item.amount)),
            }
          } else {
            return {
              denom: item.denom.toLocaleUpperCase(),
              amount: Tools.FormatScientificNotationToNumber(item.amount),
            }
          }
        })
      } else {
        if ((amount[0].denom && amount[0].amount && amount[0].denom === Constant.Denom.IRISATTO) || amount[0].amount == 0) {
          amountNumber = amount[0].amount > 0 ? String(Tools.numberMoveDecimal(amount[0].amount)) : Number(amount[0].amount).toFixed(2)
          tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
        } else if (amount[0].denom && amount[0].amount && amount[0].denom !== Constant.Denom.IRISATTO) {
          amountNumber = amount[0].amount
          tokenName = amount[0].denom.toLocaleUpperCase()
        } else {
          amountNumber = Tools.formatStringToFixedNumber(Tools.FormatScientificNotationToNumber(amount[0].amount), 2)
          if (amount[0].denom === Constant.Denom.IRISATTO) {
            tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
          } else {
            tokenName = amount[0].denom ? amount[0].denom.toLocaleUpperCase() : '--'
          }
        }
      }
    } else if (amount.amount && Object.keys(amount.amount).includes('amount') && Object.keys(amount.amount).includes('denom')) {
      if (amount.denom === Constant.Denom.IRISATTO) {
        amountNumber = String(Tools.numberMoveDecimal(amount.amount))
        tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
      } else if (amount.denom !== Constant.Denom.IRISATTO) {
        amountNumber = amount.amount
        tokenName = amount.denom.toLocaleUpperCase()
      } else if (!amount.denom) {
        amountNumber = amount.amount
        tokenName = ''
      }
    } else if (amount && Object.keys(amount).includes('amount') && Object.keys(amount).includes('denom')) {
      if (amount.denom === Constant.Denom.IRISATTO) {
        amountNumber = String(Tools.numberMoveDecimal(amount.amount))
        tokenName = Constant.Denom.IRIS.toLocaleUpperCase()
      } else if (amount.denom !== Constant.Denom.IRISATTO) {
        amountNumber = amount.amount
        tokenName = amount.denom.toLocaleUpperCase()
      } else if (!amount.denom) {
        amountNumber = amount.amount
        tokenName = ''
      }
    }
    // console.log(amountNumber,tokenName,"amount information")
    return { amountNumber, tokenName, moreAmountsNumber }
  }

  static formatPercentage(number) {
    return new BigNumber(number).multipliedBy(100)
  }

  static formatUnit (item) {
    let unit = JSON.parse(localStorage.getItem('unit')) || 1
    if (typeof item === 'number' || typeof item === 'string') {
      let num = new BigNumber(Number(item))
      let Ratio = new BigNumber(Number(unit.conversionRatio))
      return Number(num.dividedBy(Ratio))
    }
    if (typeof item === 'object') {
      if (item.denom === unit.minUnit) {
        let num = new BigNumber(Number(item.amount))
        let Ratio = new BigNumber(Number(unit.conversionRatio))
        return Number(num.dividedBy(Ratio))
      } else {
        return Number(item.amount)
      }
    }
  }
  
  static findNum(str){
      return str.match(/\d+/g);
  }
}
