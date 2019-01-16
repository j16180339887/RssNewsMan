import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import * as rssParser from 'react-native-rss-parser';

export default class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rssFeeds: "https://feeds.feedburner.com/techbang"
        }
    }

    componentDidMount() {
        this._loadInitState().done()
    }

    _loadInitState = async () => {
        var rssFeeds = await AsyncStorage.getItem("rssFeeds");
        if (rssFeeds !== null) {
            this.props.navigation.navigate("Profile");
        }
    }

    addNewFeed = () => {
        // fetch('https://feeds.feedburner.com/techbang', {method: 'GET'})
        // .then((response) => {
        // console.log(JSON.stringify(response, null, 4))
        // console.log(JSON.stringify(response.text(), null, 4))
        // const parsed = new DomParser().parseFromString(response.text(), 'text/xml');
        // console.log(parsed)
        // parseString(response.text(), {trim: true}, (err, res) => {console.log(err, res)})
        // })
        // .catch((error) => {
        // console.error(error);
        // });

        let headers = new Headers({
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0 (Chrome)",
            "Accept": "*/*",
        });
        // fetch('http://feedproxy.google.com/~r/techbang/~3/tzMKDYUZPEs/58384-kodak-coin-is-finally-coming-proposed-to-raise-50-million-dollars-expected-to-be-online', {
        //         method: 'GET',
        //         headers: headers,
        //         redirect: 'follow',
        //         mode: 'cors',
        //         cache: 'default',
        //         keepalive: true
        //     })
        //     .then((response) => {
        //         // console.log(response)
        //         // console.log("--------------------")
        //         // console.log("--------------------")
        //         // // console.log(response.body())
        //         // console.log(response.text())
        //         // const parser = new DOMParser();
        //         // const parsed = DOMParser.parseFromString(response, 'text/html');
        //         // console.log(JSON.stringify(parsed, null, 4))
        //         // console.log(parsed.querySelect("meta[property='og:image']").getAttribute("content"))
        //     })

        var feeds = ["https://feeds.feedburner.com/techbang", "https://technews.tw/tn-rss"]

        Promise
        .all(feeds.map(this.getArticles))
    }

    getArticles = (url) =>
        fetch(url)
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) => {
            return Promise
            .all(rss.items.map(this.getImageUrl))
            .then((imgurl) => {
                console.log("imgurl:")
                console.log(imgurl)
                return imgurl
            })
        })


    getImageUrl = (rssitem) =>
        fetch(rssitem["links"][0]["url"])
        .then((response) => response.text())
        .then((responseData) => {
            console.log("====================responseData=======================")
            // console.log(responseData)
            var meta = /<meta[^<]*og:image[^<]*>/.exec(responseData)
            if (meta) {
                rssitem["image"] = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i.exec(meta[0])[0]
                // console.log(rssitem["links"][0]["url"])
                // console.log(rssitem["image"])
                // console.log(meta)
                return (rssitem["image"])
            }

            console.log("====================END=======================")
            return ("FFFFaillll!")
        })


    // getImageUrl = (url) => {
    //     console.log(url)
    //     let headers = {
    //         "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0 (Chrome)",
    //         "Accept": "*/*",
    //     };
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", url);
    //     Object.keys(headers).map(function (key, index) {
    //         xhr.setRequestHeader(key, headers[key]);
    //     });
    //     // xhr.setRequestHeader("Accept", headers["Accept"]);
    //     // xhr.setRequestHeader("Content-Type", headers["Content-Type"]);
    //     // xhr.setRequestHeader("Accept-Encoding", headers["accept-encoding"]);
    //     xhr.timeout = 2000;
    //     xhr.onload = () => {
    //         // console.log(xhr.readyState == XMLHttpRequest.DONE)
    //         console.log(xhr.readyState)
    //         switch (xhr.status) {
    //             case 200:
    //                 var html = xhr._response
    //                 var m;

    //                 do {
    //                     m = /<meta.*>/.exec(html)
    //                     if (m && /og:image/.test(m[0])) {
    //                         console.log(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i.exec(m[0])[0])
    //                         // var prop_re = /<meta.*>/g
    //                     }
    //                 } while (m);
    //                 console.log("------------------")
    //                 console.log("------------------")
    //                 var doc = new DOMParser().parseFromString(
    //                     '<xml xmlns="a" xmlns:c="./lite">\n' +
    //                     '\t<child>test</child>\n' +
    //                     '\t<child></child>\n' +
    //                     '\t<child/>\n' +
    //                     '</xml>', 'text/xml');
    //                 doc.documentElement.setAttribute('x', 'y');
    //                 doc.documentElement.setAttributeNS('./lite', 'c:x', 'y2');
    //                 var nsAttr = doc.documentElement.getAttributeNS('./lite', 'x')
    //                 // var doc = new DOMParser().parseFromString(xhr._response, "text/html");
    //                 // console.log(new DOMParser().parseFromString(xhr._response, "text/html"))
    //                 break;

    //             default:
    //                 console.log(xhr.status)
    //                 break;
    //         }
    //     }
    //     xhr.onreadystatechange = function () { //Call a function when the state changes.
    //         console.log("ready", xhr.readyState, XMLHttpRequest.DONE)
    //         if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    //             console.log("ready2")
    //             console.log(xhr)
    //             // Request finished. Do processing here.
    //         }
    //     }
    //     xhr.ontimeout = function (e) {
    //         console.log("timeout", e)
    //     };
    //     // console.log(xhr)

    //     xhr.send();
    // }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.blueText} >app!</Text>
                    <TextInput style={styles.textInput} placeholder="Input rss" onChangeText={ (rssFeeds) => this.setState({rssFeeds}) } />
                    <TouchableOpacity style={styles.btn} onPress={this.addNewFeed}>
                    <Text>Add Feeds</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
          );
        }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#2896d3',
        paddingLeft: 40,
        paddingRight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blueText: {
        color: "blue"
    },
    textInput: {
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 20,
    },
    btn: {
        alignSelf: 'stretch',
        backgroundColor: '#01c853',
        padding: 20,
        alignItems: "center"
    }
});