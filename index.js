#!/usr/bin/env node

import fs from "fs"
import fetch from "node-fetch"
import Table from "cli-table3"
import chalk from "chalk"
import { Spinner } from "cli-spinner"

// Read package.json and write to variable
let packages = fs.readFileSync(
    "package.json",
    "utf-8",
    (err, json) => {
        if (err) {
            console.error("Error reading package.json:", err)
            return null
        } else {
            return json
        }
    }
)

// Attempt to parse 
try {
    packages = JSON.parse(packages)
} catch (err) {
    console.error("Error parsing package.json:", err)
}

// Fetch data from NPM
const getData = async (name, version) => {
    if (version.substring(0, 1) == ("^" || "~" || "*")) {
        version = version.substring(1)
    }

    const data = await fetch(`https://registry.npmjs.org/${name}/${version}`)
        .then(res => res.json())
        .then(data => ({
            name: data.name,
            size: data.dist.unpackedSize / 1000,
            files: data.dist.fileCount
        }))

    return data
}

// Instantiate array for the data on packages
let packagesData = []
let spinner = new Spinner()
spinner.setSpinnerString(19)
spinner.start()

// Populate array with data
for (const key in packages.dependencies) {
    packagesData.push(await getData(key, packages.dependencies[key]))
}

// Calculate totals
const reducer = key => 
    packagesData.map(item => item[key])
        .reduce((sum, curr) => sum + (curr ? curr : 0))
const totalSize = reducer("size")
// const totalFiles = reducer("files")

// Use totals to calculate percents
packagesData.forEach((object, index) => {
    packagesData[index] = {
        name: object.name,
        size: object.size,
        sizepc: Math.floor(object.size* 100 / totalSize),
        ...object
    }
})

// Create table
const display = new Table({
    head: [
        chalk.blue("name"), 
        chalk.blue("size (kB)"),
        chalk.blue("size (%)"),
        chalk.blue("files")
    ]
})

// Optional sorting in arguments
let args = process.argv.slice(2)
if (args.length > 0) {
    args[0] == "size" ? packagesData.sort((a, b) => b.size - a.size) :
    args[0] == "files" ? packagesData.sort((a, b) => b.files - a.files) :
    null
}

// Populate table
packagesData.forEach(object => {
    display.push(Object.values(object))
})

spinner.stop()
console.log('\n')
console.log(display.toString())
