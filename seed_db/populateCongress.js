const db = require('../models')

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
    if (congress[i].transactions.length) {
      const foundMember = congress[i]
      foundMember.count = congress[i].transactions.length
      foundMember.save()
    }
  }

  return members
}

const congressLastNames = async () => {
  const lastNames = []
  const congress = await db.CongressMember.find(
    {},
    { house: 0, count: 0, transactions: 0 }
  )
  for (let i = 0; i < congress.length; i++) {
    console.log(congress[i].name)
    // if (
    //   congress[i].name.charAt(0) === ' ' ||
    //   congress[i].name.charAt(congress[i].name.length - 1) === ' '
    // ) {
    //   const updatedMember = await db.CongressMember.updateOne(
    //     { name: congress[i].name },
    //     {
    //       name: congress[i].name.trim(),
    //     }
    //   )
    //   console.log(`${congress[i].name} updated`)
    // }
    // const spaceIndex = congress[i].name.indexOf(' ')
    // const lastName = congress[i].name.slice(spaceIndex)
    // lastNames.push(lastName)
  }
  //   console.log(lastNames)
  return lastNames
}

console.log('all done')
