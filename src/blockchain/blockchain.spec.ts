import * as E from 'eth-types'
import * as util from 'ethereumjs-util'

import * as Tx from './tx'
import { as, castToHex } from '../utils/eth-utils'

interface Account {
  addressStr: string, privateKeyStr: string,
  address: E.Address, privateKey: E.PrivateKey
}
const account = (addressStr: string, privateKeyStr: string): Account => ({
  addressStr,
  privateKeyStr,
  address: as.Address(new Buffer(addressStr, 'hex')),
  privateKey: as.PrivateKey(new Buffer(privateKeyStr, 'hex'))
})

const acc1 = account('f8e9b7b0f5936c0221b56f15ea2182d796d09e63', 'c712c08b0c42c073f8c67cf5c0fa8c4cf5ffa89c0b33c2d4e53aa4fe969da887')
const acc2 = account('ca4e935c9e4d942afd42f2c932a4ab9320eda68c', 'b2267a87f32cb5375341fddad567921db4fd3b8d6e6b752605e6fbd6b6afc0ca')

test('cast Address to abi', () => {
  const adds = [acc1.address, acc2.address]
  const mapped = Tx.castAddressOrMany(adds)
  expect(mapped[0]).toBe(as.AddressHex(acc1.addressStr))
  expect(mapped[1]).toBe(as.AddressHex(acc2.addressStr))
  expect(Tx.castAddressOrMany(acc1.address)).toBe(as.AddressHex(acc1.addressStr))
})

test('const params to transaction [NO DATA]', () => {
  const t = Tx.paramsToTxConst.token.name({
    nonce: as.Nonce(0),
    to: acc2.address
  })(null)
  t.sign(acc1.privateKey)
  expect(t.from.toString('hex')).toBe(acc1.addressStr)
})

test('const params to transaction [DATA]', () => {
  const t = Tx.paramsToTxConst.manager.contractExists({
    nonce: as.Nonce(0),
    to: acc2.address
  })({
    channel: acc2.address
  })
  t.sign(acc1.privateKey)
  expect(t.from.toString('hex')).toBe(acc1.addressStr)
})
