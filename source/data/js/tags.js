const { Collection, EmbedBuilder, subtext } = require('discord.js');
 
let tagdata = new Collection();

async function setTagData() {
    let data = require('@data/tagdata');
    for (const [key, value] of Object.entries(data)) {
        tagdata.set(key, value)
    }

    exports.tagdata = tagdata;
};  

// find a tag from regex/flags
function FindTagfromRegex(input) {
    for (const [name, tag] of tagdata.entries()) {
        const regex = new RegExp(tag.regex, 'i');
        if (regex.test(input)) {
            const result = tagdata.get(name);
            result.key = name;
            return result;
        }
    }
}

function FindTag(input) {
    for (const [name] of tagdata.entries()) {
        if (name.toLowerCase() === input.toLowerCase()){
            result = tagdata.get(name);
            result.key = name;
            return result;
        }
    }
    // if no exact tag name match, try flags
    for (const [name] of tagdata.entries()) {
        if (tag.flags.includes(input.toLowerCase())) {
            result = tagdata.get(name);
            result.key = name;
            return result;
        }
    }
    // if no tag found with flags, try regex
    for (const [name, tag] of tagdata.entries()) {
        const tagregex = new RegExp(tag.regex, 'i');
        if (tagregex.test(input.toLowerCase())) {
            result = tagdata.get(name);
            result.key = name;
            return result;
        }
    }
}

// get the ranking of a tag using its key
function GetTagRanking(tagkey) {
    const sorted = Array.from(tagdata.entries())
        .sort((a, b) => b[1].uses - a[1].uses);

    const rank = sorted.findIndex(([key]) => key === tagkey);

    return rank !== -1 ? rank + 1 : '?';
}

function IncreaseTagUsage(tagkey) {
    // (!) fix needed
    fs.readFile(datapath)
    .then(body => JSON.parse(body))
        .then(json => {
        json[tagkey].uses = json[tagkey].uses + 1;
        tagdata.get(tagkey).uses = json[tagkey].uses; // update in-memory data
        return json
    })
    .then(json => JSON.stringify(json, null, 2))
    .then(body => fs.writeFile(datapath, body))
    .catch(error => console.log(error))
};

// builds an embed based on the tag obj
function TagEmbedBuilder(obj) {
    return new EmbedBuilder()
        .setColor(obj.member.displayColor || 0x5C146C)
        .setDescription(obj.content.replaceAll('\\n', '\n') + '\n\n' + subtext(`${obj.member.user} used the tag "${obj.key}"`))
}

module.exports = {
    setTagData,
    FindTag,
    FindTagfromRegex,
    GetTagRanking,
    IncreaseTagUsage,
    TagEmbedBuilder,
    tagdata
};