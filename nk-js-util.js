(function (window) {
    var $M = {};
    //list that holds routing details i.e., route url and function to execute
    $M.RoutingList = [];
    //to check status of pages
    $M.currentPage = '';

    //Routing class which has multiple properties i.e., url,function to execute when
    var RoutingClass = function (u, f, t) {
        this.Params = u.split('/').filter(function(h){ return h.length > 0; });
        this.Url = u;
        this.Fn = f;

        this.Title = t;
    };



    //simple utility function that return 'false' or url params
    //will parse url and fetches param values from 'location.href'
    var checkParams = function (urlParams, routeParams) {
        var paramMatchCount = 0, paramObject = {};

        for(var i =0 ; i < urlParams.length ; i++){
            var rtParam = routeParams[i];
            if(rtParam.indexOf(':') >= 0){
                paramObject[rtParam.split(':')[1]] = urlParams[i];
                paramMatchCount += 1;
            }
        }

        if(paramMatchCount === urlParams.length){
            return paramObject;
        }

        return false;
    };

    var returnParams = function (srcParams, dstParams) {
        if(dstParams){
            var params = {}, isMatch = true;
            for(var i =0 ;i < srcParams.length; i++){
                if(srcParams[i].indexOf(':') >= 0){
                    //it is extract param
                    if(typeof dstParams[i] === 'undefined'){
                        params[srcParams[i].substr(1)] = null;
                    }else{
                        params[srcParams[i].substr(1)] = dstParams[i];
                    }
                }else{
                    //if it is hard param, hve to check url to compare
                    if(dstParams[i] != srcParams[i]){
                        isMatch = false;
                        break;
                    }
                }
            }
            return { IsMatch: isMatch, Params: params};
        }
    };
    $M.parseUrl = function (mvcUrl, urlToParse) {
        var sParams = mvcUrl.split('/').filter(function (h) {
            return h.length > 0;
        });
        var uParams = urlToParse.split('/').filter(function (h) {
            return h.length > 0;
        });

        return returnParams(sParams, uParams);

    };


    //will executes 'function(s)' which are binded to respective 'url'
    //along with values of url params for e.g.,
    //:     /:page/:pageid
    //:     /home/3434434
    //values will be page=>home and pageid=>3434434
    $M.loadController = function (urlToParse) {
        if($M.currentPage !== urlToParse) {
            $M.previousPage = $M.currentPage;
            $M.currentPage = urlToParse;
            var uParams = urlToParse.split('/').filter(function (h) {
                return h.length > 0;
            });
            var isRouteFound = 0;
            for (var i = 0; i < $M.RoutingList.length; i++) {
                var routeItem = $M.RoutingList[i];
                if (routeItem.Params.length === uParams.length) {
                    var _params = checkParams(uParams, routeItem.Params);
                    if (_params) {
                        _params.Title = routeItem.Title;
                        isRouteFound += 1;
                        routeItem.Fn.call(null, _params);
                    }
                }
            }
        }else{
            console.log('you are on same page dude!!!!');
        }
    };


    //uses browsers pushSate functionality to navigate from one page to another
    //and loads respective controller to execute
    $M.navigateTo = function (navigateTo) {
        window.history.pushState(null, null, navigateTo);
        $M.loadController(navigateTo);
    };

    //will add 'url' and 'function' to routing list
    $M.addRoute = function (urlToMatch, fnToExecute, t) {
        if(typeof urlToMatch === 'string'){
            $M.RoutingList.push(new RoutingClass(urlToMatch, fnToExecute, t));
        }else if(typeof urlToMatch && urlToMatch instanceof Array){
            urlToMatch.forEach(function (lItem) {
                $M.RoutingList.push(new RoutingClass(lItem, fnToExecute, t));
            });
        }

    };


    //From here its JSON encoding and decoding
    $M.encodeData = function (dataToEncode) {
        var isLoopAllow = true, data = [];
        var props = {};
        if(dataToEncode instanceof Array) {
            props = Object.keys(dataToEncode[0]);
            var index = 0;
            while(isLoopAllow) {
                if(!dataToEncode[index]){
                    isLoopAllow = false;
                }else{
                    data[index] = [];
                    for (var k = 0; k < props.length; k++) {
                        if (dataToEncode[index][props[k]] != null && dataToEncode[index][props[k]] != undefined) {
                            data[index][k] = dataToEncode[index][props[k]];
                        } else {
                            data[index][k] = null;
                        }
                    }

                }
                index++;
            }
        }
        return {"Properties": props, "Data": data};
    };


    $M.decodeData = function (encodedData) {
        var data = [],isLoopAllow = true, index = 0;
        if(encodedData.Properties && encodedData.Data){
            while (isLoopAllow){
                if(encodedData.Data[index] && encodedData.Data[index] instanceof Array){
                    data[index] = {};
                    for (var k = 0; k < encodedData.Properties.length; k++) {
                        data[index][encodedData.Properties[k]] = encodedData.Data[index][k];
                    }
                }else{
                    isLoopAllow = false;
                }

                index++;
            }
        }
        return data;
    };
    //binding routing object to window as '$NK'
    window.$NK = $M;
})(window);