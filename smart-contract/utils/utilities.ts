import { Contract } from 'ethers'
import { BigNumber as BN } from 'bignumber.js'
// import {
//   BigNumber,
//   bigNumberify,
//   getAddress,
//   keccak256,
//   defaultAbiCoder,
//   toUtf8Bytes,
//   solidityPack
// } from 'ethers';
import { ethers } from 'ethers';

const { getAddress, keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } = ethers.utils;

export const MINIMUM_LIQUIDITY = ethers.BigNumber.from(10).pow(3)

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')
)

export function expandTo18Decimals(n: number,p = 18): any {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(p)).toString()
}

export function expandTo18DecimalsRaw(n: number,p = 18): any {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(p));
}

export const sleep = (ms: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(true);
    }, ms)
  )

export function expandToNumber(bnAmount: any, precision = 18) {
  let bnPrecision = ethers.BigNumber.from(10).pow(precision)
  bnAmount = bnAmount.div(bnPrecision)
  return bnAmount
}

export function expandToString(bnAmount: any, precision = 18) {
  let bnPrecision = ethers.BigNumber.from(10).pow(precision)
  bnAmount = bnAmount.div(bnPrecision)
  return bnAmount.toString()
}

export function convertBigNumber(bnAmount: any) {
  return new BN(bnAmount.toString()).dividedBy(new BN(1e18)).toFixed()
}

export function newBigNumber(val: any) {
  return ethers.BigNumber.from(val)
}

function getDomainSeparator(name: string, tokenAddress: string) {
  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes('1')),
        1,
        tokenAddress
      ]
    )
  )
}

export function getCreate2Address(
  factoryAddress: string,
  [tokenA, tokenB]: [string, string],
  bytecode: string
): string {
  const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
  const create2Inputs = [
    '0xff',
    factoryAddress,
    keccak256(solidityPack(['address', 'address'], [token0, token1])),
    keccak256(bytecode)
  ]
  const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
  return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
}

export async function getApprovalDigest(
  token: Contract,
  approve: {
    owner: string
    spender: string
    value: any
  },
  nonce: any,
  deadline: any
): Promise<string> {
  const name = await token.name()
  const DOMAIN_SEPARATOR = getDomainSeparator(name, token.address)
  return keccak256(
    solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, approve.owner, approve.spender, approve.value, nonce, deadline]
          )
        )
      ]
    )
  )
}

export async function mineBlock(provider: any, timestamp: number): Promise<void> {
  await new Promise(async (resolve, reject) => {
    ;(provider._web3Provider.sendAsync as any)(
      { jsonrpc: '2.0', method: 'evm_mine', params: [timestamp] },
      (error: any, result: any): void => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })
}

export function encodePrice(reserve0: any, reserve1: any) {
  return [reserve1.mul(ethers.BigNumber.from(2).pow(112)).div(reserve0), reserve0.mul(ethers.BigNumber.from(2).pow(112)).div(reserve1)]
}
