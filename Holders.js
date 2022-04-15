const axios = require("axios");

axios
  .get(
    "https://api-v2-mainnet.paras.id/collection-stats?collection_id=monkegodz.tenk.near"
  )
  .then((res) => {
    process.stdout.write(
      JSON.stringify(res.data.data.results.owner_ids),
      +"\n"
    );
  })
  .catch((error) => {
    console.error(error);
  });
