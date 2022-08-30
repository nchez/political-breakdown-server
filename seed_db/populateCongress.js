const db = require('../models')

// creates Congress member if they do not exist in collection and populates their transaction array
const populateCongress = async () => {
  const txns = await db.Transaction.find()
  members = []
  for (let i = 0; i < txns.length; i++) {
    if (!members.includes(txns[i].representative)) {
      members.push(txns[i].representative)
      const newCongressMember = {
        name: txns[i].representative,
        house: txns[i].house,
      }
      await db.CongressMember.create(newCongressMember)
    }
    const matchedCongressMember = await db.CongressMember.findOne({
      name: txns[i].representative,
    })
    matchedCongressMember.transactions.push(txns[i]._id)
    matchedCongressMember.save()
    console.log(`${i}`)
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

// sortCongressMembers()
congressLastNames()

console.log('all done')
