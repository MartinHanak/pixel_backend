import express, {RequestHandler, Request, Response} from 'express';
import { User, UserCreationAttribues } from '../models/user';

export const router = express.Router();

// get all users
router.get('/', (async(_req : Request, res: Response) => {
    const users = await User.findAll();
    res.json(users);
}) as RequestHandler);


const isValidUserInput = (input: any): input is UserCreationAttribues => {
    if(input.username && input.password ) {
        return true;
    } else {
        return false;
    }
};

// get one user
router.get('/:id', (async(_req: Request, res: Response) => {
    const user = await User.findByPk(_req.params.id);
    if(user) {
        res.json(user);
    } else {
        res.status(404).end();
    }
} ) as RequestHandler);

// create a new user
router.post('/', (async (_req: Request, res: Response) => {
    console.log(_req.body);
    try {
       // const user = await User.create(_req.body);
       // const user = User.build(_req.body as Optional<any,string>);
       // await user.save();

        //const user = new User(_req.body);
        //user.save();

       // res.json(user);
       //await new Promise(resolve => setTimeout(resolve, 2000));

       if (isValidUserInput(_req.body)) {
        const user = await User.create(_req.body);
        res.json(user);
       } else {
        res.status(400).json({error: "Input is not a valid user input"});
       }
    } catch(error) {
        res.status(400).json({error});
    }
}) as RequestHandler);