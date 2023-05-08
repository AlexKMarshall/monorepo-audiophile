import {
  copySection,
  currency,
  product,
  productCategory,
} from '@audiophile/content-schema'

export const schemaTypes = [
  productCategory.schema(),
  product.schema(),
  currency.schema(),
  copySection.schema(),
]
