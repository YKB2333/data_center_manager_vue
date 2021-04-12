
export const StockType = {
  'leOneThirdTotal': 1,
  'leOneTwoTotal': 2,
  'leTwoThirdTotal': 3,
  'gtTwoThirdTotal': 4,
  'noManufactureDateTotal': 5,
  'noExpiryDateTotal': 6,
  'pastShelfLifeTotal': 7,
  'inferiorGoodsTotal': 8,
  'damagedAndExpiredTotal': 9
}

export const StockTypeText = {
  1: '1/3效期内',
  2: '1/3-1/2效期',
  3: '1/2-2/3效期',
  4: '大于2/3效期',
  5: '生产日期不全',
  6: '效期不敏感（基础资料无保质期）',
  7: '过保质期',
  8: '不良品仓',
  9: '破损过期（待报废仓库存）'
}