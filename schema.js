const { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLObjectType } = require('graphql');
const axios = require('axios')

const LauchType = new GraphQLObjectType({
    name: "Launch",
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: {
            type: RocketType
        }
    })
});
// ========================

const RocketType = new GraphQLObjectType({
    name: "Rocket",
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString },

    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: new GraphQLList(LauchType),
            resolve(parentValue, args) {
                return axios.get('https://api.spacexdata.com/v3/launches')
                    .then(res => res.data)
            }
        },
        launch: {
            type: LauchType,
            args: {
                flight_number: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                console.log('args', parentValue)
                return axios
                    .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
                    .then(res => res.data)
            }

        },
        rockets: {
            type: new GraphQLList(RocketType),
            resolve(parentValue, args) {
                return axios.get('https://api.spacexdata.com/v3/rockets')
                    .then(res => res.data)
            }
        },
        rocket: {
            type: RocketType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                console.log('args', parentValue)
                return axios
                    .get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
                    .then(res => res.data)
            }

        }
    }

});


module.exports = new GraphQLSchema({
    query: RootQuery
})