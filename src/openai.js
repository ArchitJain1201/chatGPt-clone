// const { Configuration, OpenAIApi } = require('openai');
// const Configuration = new Configuration({apiKey: 'sk-9i39i392323442342'});
// const openai = new OpenAIApi(configuration);

// export async function sendMsgToOpenApi(message) {
//     const res = await openai.createCompletion({
//         model: 'text-devinci-003',
//         prompt: message,
//         temperature: 0.5,
//         max_tokens: 100,
//         top_p: 1.0,
//         frequency_penalty: 0.0,
//         presence_penalty: 0.0
//     });
//     return res.data.choices[0].text;
// }