/**
 * kintone Webhook Send Example
 */

const axios = require('axios')

const conf = require('./config.json')

exports.exampleKintoneWebhookSend = async (req, res) => {

  // check by webhookKey
  if (req.body.webhookKey) {

    if(req.body.webhookKey !== conf.SPALO_WEBHOOK_KEY){

      console.log('webhookKey Error');
      return res.status(401).send('Unauthorized')
      
    }

  } else {

    return res.send('OK')
  
  }

  const auth = Buffer.from(conf.kintone.loginName + ':' + conf.kintone.loginPassword).toString('base64') 
  const headers = {
    "Content-Type": "application/json",
    "X-Cybozu-Authorization": auth
  }

  const data = req.body.data

  async function main() {

    try {
      
      const instance = axios.create({headers})

      const record = {
        "名前":{"value": data["名前"]},
        "日付":{"value": data["日付"]},
        "体温":{"value": data["体温"]},
        "体調":{"value": data["体調"]}
      }

      const response = await instance.post(
        'https://' + conf.kintone.subdomain + '.cybozu.com/k/v1/record.json',
        {"app": conf.kintone.appId, record}
      )
      
      if(response.status === 200){

        res.send("OK")
      
      }else{

        res.status(400).send('Error1')
        console.log(response)
      
      }

    } catch (err) {

      res.status(400).send('Error2')
      console.log(err)
    
    }

  }

  main()

}
