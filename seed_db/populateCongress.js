require('dotenv').config()
const db = require('../models')
const axios = require('axios')

// config for probulica
const config = {
  headers: {
    // accept: 'application/json',
    'X-API-Key': process.env.PROPUBLICA_API_KEY,
  },
}

// GET https://api.propublica.org/congress/v1/{congress}/{chamber}/members.json
const addPropublicaId = async () => {
  const ids = await db.ProApi.find({})
  console.log(ids.length)
  const idArr = ids.map((e) => e.apiId)
  const filtered = idArr.filter((element, index, array) => {
    return array.slice(index + 1).includes(element) === true
  })
  for (let i = 0; i < filtered.length; i++) {
    const idDocs = await db.ProApi.find({ apiId: filtered[i] })
    if (idDocs.length > 1) {
      idDocs[1].remove()
    }
  }
  const newIds = await db.ProApi.find({})
  console.log(filtered.length)
  console.log(newIds.length)
  // sentate
  // for (let i = 80; i < 118; i++) {
  //   let chamber = 'senate'
  //   let congress = i.toString()
  //   const probulicaUrl = `https://api.propublica.org/congress/v1/${congress}/${chamber}/members.json`
  //   console.log(probulicaUrl)
  //   const response = await axios(probulicaUrl, config)
  //   console.log(response.data)
  //   for (let j = 0; j < response.data.results[0].members.length; j++) {
  //     if (idArr.includes(response.data.results[0].members[j].id)) {
  //       continue
  //     } else {
  //       const createdId = db.ProApi.create({
  //         apiId: response.data.results[0].members[j].id,
  //         firstName: response.data.results[0].members[j].first_name,
  //         lastName: response.data.results[0].members[j].last_name,
  //       })
  //       console.log(createdId)
  //     }
  //   }
  // }
  // for (let i = 102; i < 118; i++) {
  //   let chamber = 'house'
  //   let congress = i.toString()
  //   const probulicaUrl = `https://api.propublica.org/congress/v1/${congress}/${chamber}/members.json`
  //   const response = await axios(probulicaUrl, config)
  //   for (let j = 0; j < response.data.results[0].members.length; j++) {
  //     if (idArr.includes(response.data.results[0].members[j].id)) {
  //       continue
  //     } else {
  //       const createdId = db.ProApi.create({
  //         apiId: response.data.results[0].members[j].id,
  //         firstName: response.data.results[0].members[j].first_name,
  //         lastName: response.data.results[0].members[j].last_name,
  //       })
  //       console.log(createdId)
  //     }
  //   }
  // }
}

addPropublicaId()

// creates Congress member if they do not exist in collection and populates their transaction array
const populateCongress = async () => {
  const txns = await db.Transaction.find()
  let count = 1
  for (let i = 1; i < txns.length; i++) {
    const txn = txns[i]
    const foundMember = await db.CongressMember.findOne({
      name: txn.representative.trim(),
    })
    foundMember.transactions.push(txn._id)
    foundMember.save()
    console.log((count += 1))
  }
}

const sortCongressMembers = async () => {
  const congress = await db.CongressMember.find()
  members = []
  for (let i = 0; i < congress.length; i++) {
    members.push(congress[i].name)
  }
  console.log(members)
  return members
}

const congressLastNames = async () => {
  const congress = await db.CongressMember.find(
    {},
    { house: 0, count: 0, transactions: 0 }
  )
  for (let i = 0; i < congress.length; i++) {
    let name = congress[i].name
    if (
      name.slice(-2) === 'Jr' ||
      name.slice(-2).toLowerCase() === 'ii' ||
      name.slice(-2).toLowerCase() == 'iv'
    ) {
      name = name.slice(0, -2).trim()
    }
    if (name.slice(-3) == 'Jr.') {
      name = name.slice(0, -3).trim()
    }
    if (name.slice(-3).toLowerCase() === 'iii') {
      name = name.slice(0, -3).trim()
    }
    if (name.slice(-2).toLowerCase() === 'ii') {
      name = name.slice(0, -2).trim()
    }
    const nameArr = Array.from(name)
    for (let j = nameArr.length - 1; j >= 0; j--) {
      if (nameArr[j] === ' ') {
        const lastName = name.slice(j + 1)
        congress[i].lastName = lastName
        break
      }
    }
    congress[i].save()
  }
}

const findDuplicateMembers = async () => {
  const congress = await db.CongressMember.find()
  const duplicates = []
  const members = []
  const names = []
  for (let i = 0; i < congress.length; i++) {
    if (!members.includes(congress[i].lastName)) {
      members.push(congress[i].lastName)
    } else if (members.includes(congress[i].lastName)) {
      duplicates.push(congress[i].lastName)
    }
  }
  for (let i = 0; i < duplicates.length; i++) {
    const foundMember = await db.CongressMember.find(
      {
        lastName: duplicates[i],
      },
      { transactions: 0 }
    )
    for (let j = 0; j < foundMember.length; j++) {
      names.push(foundMember[j].name)
    }
  }
  console.log(new Set(names))
}

const dupeLastNames = [
  'Tina Smith',
  'Lamar Smith',
  'Sara Jacobs',
  'Christopher L. Jacobs',
  'Susan W. Brooks',
  'Mo Brooks',
  'Robert C. "Bobby" Scott',
  'Austin Scott',
]

const addAliases = async () => {
  const aliasesArr = [
    {
      realName: 'Donald Sternoff Beyer Jr',
      aliases: ['Donald Sternoff  Beyer Jr', 'Donald Sternoff Beyer Jr.'],
    },
    {
      realName: 'Marjorie Taylor Greene',
      aliases: ['Mrs. Marjorie Taylor Greene'],
    },
    { realName: 'Kim Schrier', aliases: ['Kim Dr Schrier'] },
    { realName: 'Peter Meijer', aliases: ['Mr. Peter Meijer'] },
    { realName: 'James E. Banks', aliases: ['James E Hon Banks'] },
  ]
  for (let i = 0; i < aliasesArr.length; i++) {
    const foundMember = await db.CongressMember.findOne({
      name: aliasesArr[i].realName,
    })
    for (let j = 0; j < aliasesArr[i].aliases.length; j++) {
      foundMember.aliases.push(aliasesArr[i].aliases[j])
      const foundAlias = await db.CongressMember.findOne({
        name: aliasesArr[i].aliases[j],
      })
      for (let k = 0; k < foundAlias.transactions.length; k++) {
        foundMember.transactions.push(foundAlias.transactions[k])
      }
      foundAlias.remove()
      console.log(`${aliasesArr[i].aliases[j]} deleted`)
    }
    console.log(`${foundMember.name} updated`)
    foundMember.save()
  }
  console.log('function done')
}

const addFirstNames = async () => {
  const congress = await db.CongressMember.find(
    {
      // firstName: 'Michael',
      lastName: 'Conaway',
    },
    '-transactions'
  )
  console.log(congress[0])
}

const fixName = async () => {
  const foundWrongName = await db.CongressMember.find({ lastName: 'Mitchell' })
  foundWrongName[0].name = foundWrongName[0].name.trim()
  foundWrongName[0].save()

  console.log(foundWrongName)
}

const addTxnCounts = async () => {
  const congress = await db.CongressMember.find()
  for (let i = 0; i < congress.length; i++) {
    congress[i].count = congress[i].transactions.length
    congress[i].save()
    console.log(i)
  }
}

console.log('all done')
