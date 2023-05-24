import app from './app'
import { PORT } from './util/config';
import { connectToDatabase } from './util/db';


const start = async () => {

    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    
};

start()
.catch(() => console.log("App failed at startup"));
