'use strict';
var loadAllItems = require('./datbase.js');
var loadPromotions = require('./promotions.js');

module.exports = function main(selectedItems) {
    printInventory(selectedItems);
};

module.exports = function printInventory(selectedItems) {
    var m = {};
    for (let i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].length > 10) {
            var temp = selectedItems[i].split('-');
            m[temp[0].trim()] = parseInt(temp[1].trim());
        }
        else {
            if (selectedItems[i] in m) {
                m[selectedItems[i]] = m[selectedItems[i]] + 1;
            }
            else {
                m[selectedItems[i]] = 1;
            }
        }
    }
    var res ='***<没钱赚商店>购物清单***\n';

    var items = loadAllItems();
    var promotions = loadPromotions();
    var sum = 0.00;
    var charge = 0.00;
    for (var key in m) {
        for (let i = 0; i < items.length; i++) {
            var curprice = 0;
            var curcharge = 0;
            if (key == items[i].barcode) {
                curprice = m[key] * items[i].price;
                if (promotions[0].barcodes.indexOf(key) != -1) {
                    if (m[key] >= 2) {
                        curcharge =Math.round(items[i].price*100)/100 ;
                    }
                }
                res += '名称：' + items[i].name + '，数量：' + m[key] + items[i].unit + '，单价：' + (items[i].price).toFixed(2) + '(元)，小计：' + (curprice - curcharge).toFixed(2) + '(元)\n';
            }
            sum += Math.round((curprice - curcharge)*100)/100;
            charge +=Math.round(curcharge*100)/100 ;
        }
    }
    res += '----------------------\n' + '挥泪赠送商品:\n';
    for (let i = 0; i < promotions[0].barcodes.length; i++) {
        for (let j = 0; j <items.length ; j++) {
            if (items[j].barcode == promotions[0].barcodes[i]) {
                if (m[items[j].barcode] >= 2) {
                    res += '名称：' + items[j].name + '，数量：1' + items[j].unit + '\n';
                    break;
                }
            }
        }
    }
    res += '----------------------\n' + '总计：' + sum.toFixed(2) + '(元)\n' + '节省：' + charge.toFixed(2) + '(元)\n'
      + '**********************';
    console.log(res);
};
