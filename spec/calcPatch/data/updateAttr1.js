module.exports = {
    "name" : "updateAttr1",
    "trees" : [
        {
            "tag" : "input",
            "attrs" : {
                "value" : "text"
            }
        },
        {
            "tag" : "input",
            "attrs" : {
                "value" : "new text"
            }
        }
    ],
    "patch" : [
        {
            "type" : 2,
            "path" : "",
            "attrName" : "value",
            "attrVal" : "new text"
        }
    ]
};