import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
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
            rssLinks: []
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

        // let headers = new Headers({
        //     "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0 (Chrome)",
        //     "Accept": "*/*",
        // });
        // fetch('http://feedproxy.google.com/~r/techbang/~3/tzMKDYUZPEs/58384-kodak-coin-is-finally-coming-proposed-to-raise-50-million-dollars-expected-to-be-online', {
        //         method: 'GET',
        //         headers: headers,
        //         redirect: 'follow',
        //         mode: 'cors',
        //         cache: 'default',
        //         keepalive: true
        //     })

        var feeds = [
            "https://feeds.feedburner.com/techbang",
            "https://technews.tw/tn-rss",
            "https://www.gamebase.com.tw/news/rss/0",
            "http://news.everydayhealth.com.tw/feed",
            "http://feeds.bbci.co.uk/zhongwen/trad/rss.xml"
        ]

        Promise
        .all(feeds.map(this.getArticles))
        .then((rssitem) => {
            console.log("All done!")
            console.log(rssitem.length)
            // console.log(rssitem[0][0])
            this.setState({
                rssLinks: [].concat(...rssitem).filter(e => e!=null)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getArticles = url =>
        fetch(url)
        .then((response) => response.text())
        .then((responseData) => rssParser.parse(responseData))
        .then((rss) =>
            Promise
            .all(rss.items.map(this.getImageUrl))
            .then((rssitem) => {
                return rssitem
            })
        )
        .catch((err) => {
            console.log(err)
        })


    getImageUrl = rssitem =>
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
                // console.log(rssitem)
                return rssitem
            }
            console.log("====================END=======================")
            return {}
        })
        .catch((err) => {
            console.log(err)
        })

    render() {
        if (this.state.rssLinks.length !== 0) {
            // return (<View style={styles.container}>
            //             <Image style={{width: 50, height: 50}} source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}} />
            //         </View>
            // )
            return (
                <View style={styles.container}>
                    { this.state.rssLinks.map((rssLink) => {
                        console.log(rssLink["image"])
                        if (rssLink["image"]) {
                            return <Image source={{uri: rssLink["image"]}} style={{width: 250, height: 100}} />
                        }
                        return <Text></Text>
                    }) }
                 </View>
            )
        }
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
          )
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