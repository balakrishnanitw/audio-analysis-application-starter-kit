!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(){"use strict";$(document).ready(function(){function getUrlAndRedirect(){var input=$(".video-picking--input").val(),myRe=/.*www\.youtube\.com\/watch?.*v=(.*)$/,myArray=myRe.exec(input);(null==myArray||2!=myArray.length)&&(myRe=/.*youtu\.be\/(.*)/,myArray=myRe.exec(input)),null!=myArray&&2==myArray.length&&window.location.assign("/dashboard?v="+myArray[1])}$(".video-picking--input-btn").on("click",getUrlAndRedirect),$(".video-picking--input").keypress(function(e){13==e.which&&getUrlAndRedirect()})})},{}]},{},[1]);
