async function getHolders(collectionID) {
	let res = await fetch("https://api-v2-mainnet.paras.id/collection-stats?collection_id=" + collectionID).then(res => res.json()).catch((error) => {
		console.error(error);
	});
	holders = res.data.results.owner_ids
	return holders
}
async function getCollectionsOf(user) {
	return await fetch(
		"https://api-v2-mainnet.paras.id/collections?creator_id=" + user
	), then(res => res.json())
		.then((res) => {
			return (res.data.data.results);
		})
		.catch((error) => {
			console.error(error);
		});
}

function test() {

	let meta = {
		"jsonrpc": "2.0",
		"id": "dontcare",
		"method": "query",
		"params": {
			"request_type": "call_function",
			"finality": "final",
			"account_id": "nearch4n.sputnikdao.near",
			"method_name": "get_policy",
			"args_base64": ""
		}
	}
	getDaoInfo(meta).then(res => console.log(res))
}

async function getDaoInfo(meta) {
	let temp = await fetch("http://archival-rpc.mainnet.near.org", meta)
	return dataToString(temp);
}


function dataToString(data) {
	let hex = toHexString(data.result.result)
	let str = hex_to_ascii(hex)
	return str.substring(2, str.length - 1)
}

function tob64(s) {
	return Buffer.from(s).toString('base64');
}

function hex_to_ascii(str1) {
	var hex = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}
function toHexString(byteArray) {
	var s = '0x';
	byteArray.forEach(function (byte) {
		s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
	});
	return s;
}
// open a connection to the NEAR platform
async function init() {
	const { connect, keyStores, WalletConnection } = nearApi;

	const config = {
		networkId: "mainnet",
		keyStore: new keyStores.BrowserLocalStorageKeyStore(),
		nodeUrl: "https://rpc.mainnet.near.org",
		walletUrl: "https://wallet.mainnet.near.org",
		helperUrl: "https://helper.mainnet.near.org",
		explorerUrl: "https://explorer.mainnet.near.org",
	};

	// connect to NEAR
	const near = await connect(config);

	// create wallet connection
	const wallet = new WalletConnection(near,"dao seat connector");
	window.near = near
	window.wallet = wallet
	// redirects user to wallet to authorize your dApp
	// this creates an access key that will be stored in the browser's local storage
	// access key can then be used to connect to NEAR and sign transactions via keyStore

	const signIn = () => {
		wallet.requestSignIn(
			"sputnikdao.near", // contract requesting access
			"sputnik dao seat adder for holders",
		);
	};
	if(!wallet.isSignedIn()) {
		signIn();
	}
	
};
init()

async function getDaoContract(addy) {
	const methodOptions = {
		"viewMethods": [
			"version",
			"get_config",
			"get_policy",
			"get_staking_contract",
			"has_blob",
			"get_available_amount",
			"delegation_total_supply",
			"delegation_balance_of",
			"get_last_proposal_id",
			"get_proposals",
			"get_proposal",
			"get_bounty",
			"get_last_bounty_id",
			"get_bounties",
			"get_bounty_claims",
			"get_bounty_number_of_claims"
		],
		"changeMethods": [
			"new",
			"migrate",
			"store_blob",
			"remove_blob",
			"add_proposal",
			"act_proposal",
			"bounty_claim",
			"bounty_done",
			"bounty_giveup",
			"register_delegation",
			"delegate",
			"undelegate"
		],
	};
	try {
		let contract = new nearApi.Contract(
			window.wallet.account(),
			addy,
			methodOptions
		);
		window.contract=contract;
		return await contract.get_policy();
	} catch (err) {
		window.alert("contract doesnt support get_policy")
	}

}

function mergeholders(holders, policy) {
	// let newList=[];
	let newList = holders.filter(o1 => policy.some(o2 => o1.owner.id === o2.owner.id));

	return newList;
}

function setNewPolicy( policy) {
	window.contract.add_proposal({
		propsal: {
			"description": "change policy members / roles",
			"kind": {
				ChangePolicy: policy
			}
		}
	})
}

// document.getElementById("contractid").addEventListener("change",async (e)=>{
// 	let holders = await getHolders(e.target.value)
// 	let list= document.getElementById("holdersList")
// 	// holders.forEach(hol=>{
// 	// 	list.insertAdjacentHTML("beforeend",`<li>${hol}</li>`)
// 	// })
// })
// document.getElementById("daoaddy").addEventListener("change",async (e)=>{
// 	let policy = await getDaoContract(e.target.value)
// 	let list= document.getElementById("holdersList")
// 	console.log(policy);
// })

async function buttonClick(){
	let holders = await getHolders(document.getElementById("contractid").value)
	let contract=document.getElementById("daoaddy").value
	let policy = await getDaoContract(contract)
	let holderRole={}
	let holderIndex;
	policy.roles.forEach((x,i)=>{
		if(x.name=="Holders"){
			holderIndex=i;
			holderRole=x;
		}
	})
	if(holderIndex==undefined){
		holderIndex = policy.roles.length;
		holderRole = {
			"name": "Holders",
			"kind": {
				"Group": []
			},
			"permissions": [
				"*:VoteReject",
				"*:VoteRemove",
				"*:VoteApprove",
				"*:AddProposal",
				"*:Finalize"
			],
			"vote_policy": {}
		}
	}
	console.log(holderRole,holderRole.kind.Group.length)
	holderRole.kind.Group= [...holderRole.kind.Group,...holders];
	console.log(holderRole)
	policy.roles[holderIndex]=holderRole;
	setNewPolicy(policy)
	// let newList= holderRole.kind.Group(o1 => holders.some(o2 => o1 === o2));
}
document.getElementById("fancybtn").addEventListener("click",buttonClick)