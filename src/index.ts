import initializeApp from "./app";

const main = async () => {
    try {
        console.log('Starting bot...');
        initializeApp();
        console.log('The bot was started!');
    } catch(error) {
        console.log('An error occurred while starting the bot! :(', error);
    };
};

main();
