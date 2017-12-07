import React, {Component} from 'react';
import sanitize from 'sanitize-html';

var styles = {
    "quotebox-outer": {
        top: "50%", left: 10, right: 10,
        position: 'absolute',
        minWidth: '300px',
        maxWidth: "500px",
        margin: 'auto',
        transform: "translateY(-50%)",
        backgroundColor: 'white'
    },
    "quotebox-inner": {
        margin: 30
    },
    "quotebox-text": {
        width: "100%"
    },
    "quotebox-author": {
        width: "100%",
        margin: "20 0 20 0",
        textAlign: "right",
        color: "#aaa",
        fontStyle: "italic",
    },
    "quotebox-functions": {
        width: "100%"
    },
    "quotebox-social": {
        display: "inline-block",
        float: 'left'
    },
    "quotebox-new-quote": {
        display: "inline-block",
        float: "right"
    },
    "quotebox-clearfix": {
        clear: 'both',
        content: "",
        display: "table"
    },
    "quotebox-api-link-box": {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "10pt",
        color: "#ccc"
    },
    "quotebox-api-link": {
        color: "green"
    },
    "button": {
        padding: "10px 20px",
        color: "white",
        fontSize: "14pt",
        backgroundColor: "rgb(255, 127, 80)",
        border: 0,
        borderRadius: "4pt"
    }
};

/**
 * handles json calls to our random quote API
 * 
 * TODO: implement our own random quote API
 */
function getNewQuote(cb) {
    var apiURI = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&time=" + Date.now();  // append time to ensure we are not getting a cached value
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
            var json = JSON.parse(req.responseText)[0];  // our API sends a string which needs to be parsed
            
            // normalize response
            return cb({
                loading: false,
                author: json.title,
                quote: sanitize(json.content, { allowedTags: [], allowedAtributes: [] }).trim()  // (this API puts HTML formatting codes. strip)
            });
        }
    };
    req.open("GET", apiURI, true);
    req.send();
}

/**
 * wrapper class for html button element
 */
class Button extends Component {
    render() {
        return <button style={styles['button']} onClick={this.props.onClick}>
            {this.props.children}
        </button>;
    }
}

/**
 * the meat of our application
 */
class QuoteBox extends Component {
    constructor(props) {
        super(props);
        
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getNewQuote = this.getNewQuote.bind(this);
        this.tweetQuote = this.tweetQuote.bind(this);
        
        this.state = {
            loading: true,
            quote: "",
            author: ""
        };
    }
    
    componentDidMount() {
        this.getNewQuote();
    }
    
    getNewQuote() {
        var quoteBox = this;
        getNewQuote(function(res) {
            quoteBox.setState(res);
        });
    }
    
    tweetQuote() {
        var href = "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=";  // borrowing hashtag and related from fcc example
        href += `"${this.state.quote}" -${this.state.author}`;
        window.open(href);
    }
    
    render() {
        return <div style={styles['quotebox-outer']}>
            {this.state.loading ? <div></div>
            : <div style={styles['quotebox-inner']}>
                <div style={styles['quotebox-text']}>{this.state.quote}</div>
                <div style={styles['quotebox-author']}>&#8212;{this.state.author}</div>
                <div style={styles['quotebox-functions']}>
                    <div style={styles['quotebox-social']}><Button onClick={this.tweetQuote}><span className="fa fa-twitter"></span></Button></div>
                    <div style={styles['quotebox-new-quote']}><Button onClick={this.getNewQuote}>&#8635;</Button></div>
                    <div style={styles['quotebox-clearfix']}></div>
                </div>
                <div style={styles['quotebox-api-link-box']}>Powered by <a style={styles['quotebox-api-link']} href="https://quotesondesign.com">quotesondesign.com</a></div>
            </div> }
        </div>;
    }
}

export default QuoteBox;