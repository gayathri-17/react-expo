import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import ViewPager from '@react-native-community/viewpager';

export default class ImageViewer extends React.Component {
    constructor(props) {
        super(props);
        let params = props.route.params || {}
        this.state = {
            imageArray: params ? props.route.params.imageArray : [],
            index: params ? props.route.params.index : 0
        }
    }
    render() {
        return (
            <View style={styles.viewPager}>
                <ViewPager style={styles.viewPager} initialPage={this.state.index}>
                    {this.state.imageArray.map((item, index) => {
                        return (
                            <Image key={index} style={styles.imageView} source={{ uri: item }}></Image>
                        )
                    })}
                </ViewPager>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
    },
    imageView: {
        flex: 1,
        resizeMode: 'cover'
    }
});