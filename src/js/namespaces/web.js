let web = {
    reload: function (ReloadFromServer) {
        window.location.reload(ReloadFromServer);
    },
    redirect: function (url) {
        // window.location.href = u;
        window.location.replace(url);
    },
    newTab: function (url) {
        window.open(url, '_blank');
    },
    getUrlWithQueryString: function () {
        return window.location.href;
    },
    getUrlWithoutQueryString: function () {
        return window.location.href.split('?')[0];
    },
    getQueryString: function (name) {
        if (!name)
            return window.location.search.substring(1);
        else {
            let url = web.getUrlWithQueryString();
            name = name.replace(/[\[\]]/g, "\\$&");
            let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    },
    updateQueryString: function (key, value, url) {
        if (!url) url = window.location.href;
        let re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + "=" + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/([&?])$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        }
        else {
            if (typeof value !== 'undefined' && value !== null) {
                let separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
            else
                return url;
        }
    },
    queryStringToObject: function () {
        let search = location.search.substring(1);
        if (search) {
            return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        }
    },
};

export default web