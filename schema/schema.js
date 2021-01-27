const graphql = require('graphql');
var _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql


const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
            }
        }
    })
})

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        }
    })
})

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },

            resolve(parent, args) {
                return User.findById(args.id)
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },

        hobby: {
            type: HobbyType,
            args: { id: { type: GraphQLID } },

            resolve(parent, args) {
                return Hobby.findById(args.id);
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
            }
        },

        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },

            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
            }
        }


    }
})

// Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        CreateUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                profession: { type: GraphQLString }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                user.save();
                return user;
            }
        },

        CreatePost: {
            type: PostType,
            args: {
                comment: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let post = new Post({
                    comment: args.comment,
                    userId: args.userId
                })
                post.save();
                return post;
            }
        },

        CreateHobby: {
            type: HobbyType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                userId: { type: GraphQLID }
            },

            resolve(parent, args) {
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                hobby.save();
                return hobby;
            }
        },

        UpdateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                profession: { type: GraphQLString }

            },
            resolve(parent, args) {
                return updatedUser = User.findByIdAndUpdate(
                    args.id, {
                    $set: {
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    }
                },
                    { new: true }
                )
            }
        },

        UpdateHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return updatedHobby = Hobby.findByIdAndUpdate(
                    args.id, {
                    $set: {
                        title: args.title,
                        description: args.description
                    }
                },
                    { new: true }
                )
            }
        },

        UpdatePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                comment: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return updatedPost = Post.findByIdAndUpdate(
                    args.id, {
                    $set: {
                        comment: args.comment
                    }
                },
                    { new: true }
                )
            }
        },

        RemovePost: {
            type: PostType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(
                    args.id
                ).exec();

                if (!removedPost) {
                    throw new ("Error")
                } else {
                    return removedPost;
                }
            }
        },

        RemoveHobby: {
            type: HobbyType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec();

                if (!removedHobby) {
                    throw new ("Error")
                } else {
                    return removedHobby;
                }
            }
        },

        RemoveUser: {
            type: UserType,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(
                    args.id
                ).exec();

                if (!removedUser) {
                    throw new ("Error");
                } else {
                    return removedUser;
                }
            }
        }


    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})