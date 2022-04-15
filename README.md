# NFTHolderPolicyUpdateNEAR
# 🏛️ Purpose:

MVP for updating DAO with a 'Holders' Policy.
1. Pull all NFT holders from [Paras]
2. Propose holders policy to sputnikv2 DAO
3. Vote on proposal in [AstroDao], but recommended testing in [AstroDaoTestNet] first!

# 📘 Procedure:
## 1. Pull all NFT holders from [Paras]:
### Install prerequisites:
 Install [NPM] and [Node.js] by running the following in cmd:
 
    npm install -g npm
    
 Check successfull installation:

    node -v
    npm -v

Install [axios] (verify installation and version similar to above commands):

    npm install axios

### Query holders of NFT from [Paras]:
1. navigate to the [Paras] landing page and find the name of your nft project through the search bar
2. select the name of the collection author, for example:

![CollAuthor]

3. Modify the API string in CollectionID.js so that it references your collections author. It looks like this:

![APIStringColl]

   The query will return a string like this, this is the collection Id and should be used in step 4.
   Run the query using the following command:
   
       node CollectionID.js
 
4. Use the result from the previous step to modify the API string in GetHolders.js, so that it references your collection ID. It looks like this:

![APIStringHolders]

   The query will return a list of all of the nft holders formatted such that they can be dropped right into our policy proposal.  Keep this for later.
   Run the query using the following command:
   
       node Holders.js

## 2. Propose holders policy to sputnikv2 DAO
### Install prerequisites:
1. Install [NEAR CLI]
2. Install [Sputnik Dao CLI]

### Update The Policy:
1. Login into NEAR.  Open a WSL (on windows) or linux terminal and login into NEAR CLI:

       near login   
   
The command will take you to a near login page (additional instructions can be found in the [NEAR CLI] documents)

2. Set some local variables for making the calls easier:
 
       DAO_ACCOUNT = 'daoname' 
 
NOTE: daoname should not include 'sputnikv2.near' or 'sputnikv2.testnet'.  This will be added by the sputnik CLI tool depending on the NEAR environment you are logged into.

       SIGNER_ACCOUNT = 'userName' 

NOTE: user name should be the name of the account you logged in with.

3.  You can pull an existing policy from the DAO and modify it as you see fit.  To pull an existing policy use the following command in the sputnik DAO CLI:
  
       ```
       sputnikdao get_policy --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT
       ```
       
The response will look something like this.  You can see that this is similar to the one in the "new_policy_sample.json" file but with different settings.  If there are multiple Roles defined in your DAO then you will want to take the role that best corresponds with the policy you want to apply to the Holders group.  You can find more details on how to modify policies [here].

![ExamplePolicyResponse]

4.  Configure the policy file for proposal submission.  The policy file is called "new_policy_sample.json", just replace the existing names under "Group" with the query response from Holders.js and edit the other sections.  Or edit the response from step 3.
 
5.  Submit the policy proposal with the following command:

       ```
       sputnikdao proposal policy new_policy_sample.json --daoAcc $DAO_ACCOUNT --accountId $SIGNER_ACCOUNT 
       ```      
       
 You should see a message like:
 
 ![SuccessMessage]

 You should also see the policy proposal in the [AstroDao] or [AstroDaoTestNet] UIs.
 
 Now it's time to VOTE!
 
 
 
[Paras]: https://paras.id/
[AstroDao]: https://astrodao.com/
[AstroDaoTestNet]: https://testnet.app.astrodao.com/my/feed
[NPM]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[Node.js]: https://nodejs.dev/download/package-manager/
[axios]: https://www.npmjs.com/package/axios
[CollAuthor]: https://github.com/OllieMurray/NFTHolderPolicyUpdateNEAR/blob/main/MonkeyGodImage.png "Collection Author"
[APIStringColl]: https://github.com/OllieMurray/NFTHolderPolicyUpdateNEAR/blob/main/CollectionIDAPI.png "API String"
[APIStringHolders]: https://github.com/OllieMurray/NFTHolderPolicyUpdateNEAR/blob/main/HoldersAPI.png "API String"
[NEAR CLI]: https://docs.near.org/docs/tools/near-cli
[Sputnik Dao CLI]: https://www.npmjs.com/package/sputnikdao
[SuccessMessage]:https://github.com/OllieMurray/NFTHolderPolicyUpdateNEAR/blob/main/SuccessMessage.png
[ExamplePolicyResponse]:https://github.com/OllieMurray/NFTHolderPolicyUpdateNEAR/blob/main/getPolicyOutput.png
[here]: https://github.com/near-daos/sputnik-dao-contract/tree/feat/enchance-contract-v2-readme/sputnikdao2
