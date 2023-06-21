const resObj = ()=>({
    nonce : new Date().getTime(),
    error   : {
        fields : {
            count : 0,
            errors: []
        },
        systems : {
            count : 0,
            errors: []
        }
    },
    status: 200,
    message: "",
    metadata: {
        page: 1,
        totalPage: 1,
        totalCount: 1,
        limit: 1
    },
    payload : {

    }
});
module.exports = resObj
