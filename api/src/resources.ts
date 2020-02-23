export default {
    Registration_EmailExists: 'User with this email already exists',
    Login_EmailIncorrect: 'Email is incorrect.',
    Login_PasswordIncorrect: 'Password is incorrect.',
    Generic_ErrorMessage: 'Oops! Something went wrong.',
    Generic_InvalidToken: 'Invalid token',
    Generic_PleaseLogin: 'Please login.',
    Generic_ValidationError: 'Provided data is not valid.',
    Generic_EntityNotFound: (entity: string) => `${entity} not found`,
    Task_CategoryNotFound: 'Category associated with selected Roadmap was not found',
    Assistant_EntityNotFound: (entity: string) => `Sorry, I couldn't find this ${entity}`
};
