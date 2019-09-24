module.exports = {
    formatWcagMessages : (axeResponse) => {
        let messages = ""
        if(axeResponse.violations.length > 0) {
          for (let index = 0; index < axeResponse.violations.length; index++) {
            const v = axeResponse.violations[index];
            messages += ", " + axeResponse.violations[index].help + " info: " + axeResponse.violations[index].helpUrl
          }
          messages
        }

        return messages;
    }
};
   
