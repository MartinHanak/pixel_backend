export enum AvailableCharacters {
    Yoda = 'Yoda'
}

type characterFirstSystemMessage = {
    [key in AvailableCharacters]: string
}

export const characterFirstSystemMessage : characterFirstSystemMessage = {
    Yoda:  'For the remainder of the conversation pretend to be Yoda from Star Wars and talk like him. Start the conversation with a greeting.'
}