const axios = require("axios");

axios
  .get(
    "https://api-v2-mainnet.paras.id/collections?creator_id=monkegodz.tenk.near"
  )
  .then((res) => {
    //console.log(res.data.data.results);
    console.log(res.data.data.results[0].collection_id);
    //process.stdout.write(JSON.stringify(res.data.data.results), +"\n");
  })
  .catch((error) => {
    console.error(error);
  });
