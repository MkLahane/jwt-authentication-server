import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from 'type-graphql';
import {compare, hash} from 'bcryptjs';
import { User } from './entity/User';
import { sign } from 'jsonwebtoken';
import { ContextType } from './context_types';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken : string
}

@Resolver()
export class Resolvers {
    @Query(() => String)
    hello() {
        return "Hey there!"
    }
    
    @Query(() => [User])
    getUsers() {
        return User.find();
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res} : ContextType
    ) : Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Can't find the user with given email");
        }
        const matching = await compare(password, user.password);
        if (!matching) {
            throw new Error("Incorrect password");
        }
        res.cookie('my-cookie',
            sign({ userId: user.id }, "zcvnmxmbvmxcbv", { 
                expiresIn: "7d"
            }), {
                httpOnly: true
            }
        );
        return {
            accessToken: sign({ userId: user.id }, "qoequweoiuasdnmcvx", {
                expiresIn: "15m"
            })
        };
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {
        
        try {
            await User.insert({
                email, 
                password: await hash(password, 12)
            });
        } catch(err) {
            console.log(err);
            return false;
        }
        return true;
    }
};