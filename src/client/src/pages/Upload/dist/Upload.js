"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/* eslint-disable react/jsx-no-undef */
var react_1 = require("@ionic/react");
var react_2 = require("react");
var core_1 = require("@capacitor/core");
var LocationMap_1 = require("../../components/LocationMap/LocationMap");
var axios_1 = require("axios");
var Geolocation = core_1.Plugins.Geolocation;
var Upload = function (props) {
    // image provided by props
    var _a = react_2.useState(), image = _a[0], setImage = _a[1];
    // Form data
    var _b = react_2.useState(""), title = _b[0], setTitle = _b[1];
    var _c = react_2.useState(""), description = _c[0], setDescription = _c[1];
    // Geoinformation
    var _d = react_2.useState(), location = _d[0], setLocation = _d[1];
    // Toast message
    var _e = react_2.useState(""), toast = _e[0], setToast = _e[1];
    react_2.useEffect(function () {
        if (props.location.state !== undefined) {
            setImage(props.location.state.image);
        }
        // get current geolocation
        Geolocation.getCurrentPosition()
            .then(function (location) {
            setLocation({
                coords: {
                    accuracy: location.coords.accuracy,
                    altitude: location.coords.altitude,
                    altitudeAccuracy: location.coords.altitudeAccuracy,
                    heading: location.coords.heading,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    speed: location.coords.speed
                },
                timestamp: location.timestamp
            });
        });
    }, [props.location.state]);
    var upload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, img;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(title !== "" && description !== "" && image !== undefined)) return [3 /*break*/, 3];
                    formData = new FormData();
                    if (!(image.webviewPath !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios_1["default"].get(image.webviewPath)];
                case 1:
                    img = _a.sent();
                    formData.append("myImage", img.data);
                    axios_1["default"].post('http://localhost:5000/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(function (res) { return console.log("Result: ", res); });
                    _a.label = 2;
                case 2: return [3 /*break*/, 4];
                case 3:
                    if (title === "") {
                        setToast("Please fill out the title field!");
                    }
                    else if (description === "") {
                        setToast("Please fill out the description field!");
                    }
                    else {
                        setToast("Error occured!");
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_2["default"].createElement(react_1.IonPage, null,
        react_2["default"].createElement(react_1.IonHeader, null,
            react_2["default"].createElement(react_1.IonToolbar, null,
                react_2["default"].createElement(react_1.IonTitle, null, "Upload"))),
        react_2["default"].createElement(react_1.IonContent, { fullscreen: true },
            react_2["default"].createElement(react_1.IonHeader, { collapse: "condense" },
                react_2["default"].createElement(react_1.IonToolbar, null,
                    react_2["default"].createElement(react_1.IonTitle, { size: "large" }, "Upload"))),
            image &&
                react_2["default"].createElement(react_2["default"].Fragment, null,
                    react_2["default"].createElement(react_1.IonImg, { src: image.webviewPath }),
                    react_2["default"].createElement(react_1.IonGrid, null,
                        react_2["default"].createElement(react_1.IonRow, null,
                            react_2["default"].createElement(react_1.IonCol, { size: "12" },
                                react_2["default"].createElement(react_1.IonItem, null,
                                    react_2["default"].createElement(react_1.IonLabel, { position: "floating" }, "Title"),
                                    react_2["default"].createElement(react_1.IonInput, { type: "text", value: title, onIonChange: function (e) { setTitle(e.detail.value); } })))),
                        react_2["default"].createElement(react_1.IonRow, null,
                            react_2["default"].createElement(react_1.IonCol, { size: "12" },
                                react_2["default"].createElement(react_1.IonItem, null,
                                    react_2["default"].createElement(react_1.IonLabel, { position: "floating" }, "Description"),
                                    react_2["default"].createElement(react_1.IonTextarea, { value: description, onIonChange: function (e) { setDescription(e.detail.value); } })))),
                        react_2["default"].createElement(react_1.IonRow, null,
                            react_2["default"].createElement(react_1.IonCol, { size: "12" },
                                "Current Position: Latitude: ", location === null || location === void 0 ? void 0 :
                                location.coords.latitude.toString(),
                                ", Longitude: ", location === null || location === void 0 ? void 0 :
                                location.coords.longitude.toString())),
                        react_2["default"].createElement(react_1.IonRow, null,
                            react_2["default"].createElement(react_1.IonCol, { size: "12" }, location &&
                                react_2["default"].createElement(LocationMap_1["default"], { location: location }))),
                        react_2["default"].createElement(react_1.IonRow, null,
                            react_2["default"].createElement(react_1.IonCol, null,
                                react_2["default"].createElement(react_1.IonButton, { onClick: upload }, "Submit"))))),
            react_2["default"].createElement(react_1.IonToast, { isOpen: toast !== "", onDidDismiss: function () { return setToast(""); }, message: toast, duration: 1500 }))));
};
exports["default"] = Upload;
