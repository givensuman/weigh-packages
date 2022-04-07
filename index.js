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
            process.exit(-1)
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
    process.exit(-1)
}

// Fetch data from NPM
const getData = async (name, version) => {
    if (version.substring(0, 1) == ("^" || "~" || "*")) {
        version = version.substring(1)
    }
    
    const data = await fetch(`https://registry.npmjs.org/${name}/${version}`)
        .then(res => res.json())
        .then(data => (
        {
            name: data.name,
            version: version,
            size: data.dist.unpackedSize / 1000,
            files: data.dist.fileCount,
            dependencies: data.dependencies ? Object.values(data.dependencies).length : 0,
            license: data.license ? data.license : "N/A"
        }
        ))

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
const totalFiles = reducer("files")
const totalDependencies = reducer("dependencies")

// Use totals to calculate percents
packagesData.forEach((object, index) => {
    packagesData[index] = {
        name: object.name,
        size: object.size,
        sizepc: Math.floor(object.size* 100 / totalSize),
        ...object
    }
})

const titles = [
    "name", "version", "size (kB)", "size (%)", "files", "dependencies", "license"
]
// Create table
const display = new Table({
    head: titles.map(item => chalk.whiteBright(item))
})

// Optional sorting in arguments
let args = process.argv.slice(2)
const sorter = key =>
    packagesData.sort((a, b) => b[key] - a[key])
if (args.length > 0) {
    if (args[0] == "--size") { sorter("size") }
    else if (args[0] == "--files") { sorter("files") }
    else {
        console.error("Unknown arguments passed to weigh-packages")
        process.exit(-1)
    }
}

// Populate table
packagesData.forEach((object, index) => {
    display.push(Object.values(object).map(item => 
        index % 2 ? chalk.blue(item) : chalk.cyan(item)
    ))
})

display.push(
    Array(Object.values(packagesData.length)).fill(""), 
    [
        "total",
        "",
        totalSize,
        100,
        totalFiles,
        totalDependencies,
        ""
    ]
)

spinner.stop()
console.log('\n')
console.log(display.toString())
