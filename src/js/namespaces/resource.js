import config from '../config'
import resourcesBank from '../resources'

const resourceFallback = 'def';
let resourceManager = {
    /*
    {pa1: 'val2', pa2: 'val2'}
    */
    get(key, replace) {
        try {
            let str = resourcesBank[key][config.locale] || resourcesBank[key][resourceFallback];
            if (str && replace)
                for (let k in replace)
                    if (replace.hasOwnProperty(k))
                        str = str.replace(':' + k, replace[k]);
            return str;
        }
        catch (ex) {
            return undefined;
        }
    },
    /*
    {
        key: '',
        en: '',
        ar: '',
    }
     */
    set(resource) {
        let key = resource.key;
        delete resource.key;

        let temp;
        if (resourcesBank[key])
        //exist
            temp = resourcesBank[key];
        else {
            //new
            resourcesBank[key] = {};
            temp = resourcesBank[key];
        }
        $.extend(temp, resource);
    },

    setArray (resourceArray) {
        for (let i = 0, l = resourceArray.length; i < l; i++)
            resourceManager.set(resourceArray[i]);
    }
};
export default resourceManager