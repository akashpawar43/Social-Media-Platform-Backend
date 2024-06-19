import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'Social Media Platform Backend By Akash Pawar',
        description: 'Backend API for a social media platform. The platform aims to provide features similar to popular social media networks like Facebook or Twitter, including user authentication, posting updates, commenting, liking posts, following users, and more.'
    },
    host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

swaggerAutogen(outputFile, routes, doc);