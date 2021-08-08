//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import { ILendingPoolAddressesProviderRegistry } from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProviderRegistry.sol";
import { ILendingPoolAddressesProvider } from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import { ILendingPool } from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import { IWETH } from "./interfaces/IWETH.sol";
import { IWETHGateway } from "@aave/protocol-v2/contracts/misc/interfaces/IWETHGateway.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "hardhat/console.sol";

contract Treasury {
  
  using SafeERC20 for IERC20;

  address [] private addressesProvidersList;
  ILendingPoolAddressesProvider private lendingPoolAddressProvider;
  ILendingPool private lendingPoolInstance;
  IWETH private wETHInstance;
  IWETHGateway private wethGatewayInstance;
  address private constant WETHAddress = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
  address private constant WETHGateway = 0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70;
  address private constant WETH = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
  event LogError(string _reason);
  event LogAddress(address _address);
  event LogMsgValue(uint256 _msgValue);

  constructor() public {
    console.log("Treasury is deployed...");
    addressesProvidersList = ILendingPoolAddressesProviderRegistry(0x1E40B561EC587036f9789aF83236f057D1ed2A90).getAddressesProvidersList();
    lendingPoolAddressProvider = ILendingPoolAddressesProvider(addressesProvidersList[0]);
    wETHInstance = IWETH(WETHAddress);
    lendingPoolInstance = ILendingPool(lendingPoolAddressProvider.getLendingPool());
    wethGatewayInstance = IWETHGateway(WETHGateway);
  }
  function deposit() external payable{
    require(msg.value != 0, "0 eth deposited");
    address payable _self = address(this);
    wETHInstance.deposit{value: msg.value}();
    wETHInstance.approve(address(lendingPoolInstance), uint256(-1));
    lendingPoolInstance.deposit(WETHAddress, wETHInstance.balanceOf(_self), _self, 0);
    
    //wethGatewayInstance.depositETH{value:msg.value}(_self, 0);
  }
  function withdraw() public {
    msg.sender.transfer((address(this).balance));
  }
  // function borrow(address _asset, uint256 _amount, uint256 _interestRateMode, uint16 _referralCode, address _onBehalfOf) public{
  //   ILendingPool.borrow(_asset, _amount, _interestRateMode, _referralCode, _onBehalfOf);
  // }
  receive() external payable {
    require(msg.sender == address(WETH), 'Receive not allowed');
  }
  fallback() external payable {
  revert('Treasury.sol -> Fallback not allowed');
  }

}
