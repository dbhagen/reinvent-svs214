/*
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict'

const AWS = require('aws-sdk')
AWS.config.region = (process.env.AWS_REGION || 'us-east-1')
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'})

const handler = async function(event) {

  const params = {
    Image: {
    S3Object: {
      Bucket: "jbesw-textract-useast1", 
      Name: "dog1.jpg"
    }
    }, 
    MaxLabels: 5, 
    MinConfidence: 70
  }

  const data = await rekognition.detectLabels(params).promise()

  const filteredResult = data.Labels.filter(function(item){
    if (item.Name === 'Dog' || item.Name === 'Cat') return item
  })
    
  if (filteredResult.length > 0) {
    if (filteredResult[0].Name === 'Dog') return 'Dog'
    if (filteredResult[0].Name === 'Cat') return 'Cat'
  }
  
  return 'Unknown'
   
}

const main = async function () {
  console.log(await handler(null))
}
main()