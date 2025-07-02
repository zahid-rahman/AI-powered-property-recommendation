"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const demoController = async (req, res, next) => {
    // this things is only idealize for quick development
    try {
        // TODO: write your logic code here
        //* Or this line of code is for clear understanding of business logic and keeping the logic separated from the controller
        //return await demoService.printMessage("Hello world")
    }
    catch (error) {
        next(error);
    }
};
exports.default = demoController;
