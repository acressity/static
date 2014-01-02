function setUp(element){
	if (element.value == element.defaultValue){
		element.value = "";
	}
	element.onblur = function() {
		if (element.value == ""){
			element.value = element.defaultValue;
		}
	}
}

function verify(message, element){
    if (element){
        message = message + "\n\n" + element.value;
    }
    if (!message){
        message = 'Are you sure?';
    }
    if (confirm(message)){
        return true;
    } else {
        return false;
    }
}


function toggle_div(element){
    // Toggles a div when called
    // div can be specified by either a string for id of div
    // or passing an element (perhaps the next div in the DOM)
    // Passing with element is STRONGLY recommended, as it allows specific reference and removes ambiguity
    // May be prudent to pass id string in instances where there is no ambiguity; perhaps it's quicker?
    if (typeof element == 'string' || element instanceof String){
        // Following for backwards compatibility
        var element = document.getElementById(element);
        var icon_id = element.id + "_toggle_icon";
        toggle_icon = document.getElementById(icon_id)
    } else {
        toggle_icon = element.previousElementSibling.firstElementChild.firstElementChild;
    }

    if (toggle_icon){
        if ($(element).css("display") == "none"){
            $(toggle_icon).attr("src", $(toggle_icon).attr("src").replace("expand", "contract"));
        } else {
            $(toggle_icon).attr("src", $(toggle_icon).attr("src").replace("contract", "expand"));
        }
    }
    $(element).toggle(300);
}

$(document).ready(function() {
	// jQuery functions to be made available upon page load

	$("#messages").click(function() {
	  $("#messages").fadeOut(1200);
	});
});


// Validates the form for signing up
function validateFirstExperience(form){
    experience = form.experience;
    if (experience.value == experience.defaultValue || experience.value.length < 1){ // They don't want to start with an experience. Perfectly fine
        //alert("Begin by submitting a new experience in the box");
        experience.value = ""; // For the catching script
        return true;
    } else {
        // User wishes to create journey with an initial experience. Cool
        //return verify('Add as an experience:', this.experience);
        return true;
    }
}


(function($)
{
    /**
* Auto-growing textareas; technique ripped from Facebook
*
* http://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
*/
    $.fn.autogrow = function(options)
    {
        return this.filter('textarea').each(function()
        {
            var self = this;
            var $self = $(self);
            var minHeight = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight'));

            var shadow = $('<div></div>').css({
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: $self.width(),
                fontSize: $self.css('fontSize'),
                fontFamily: $self.css('fontFamily'),
                fontWeight: $self.css('fontWeight'),
                lineHeight: $self.css('lineHeight'),
                resize: 'none'
            }).appendTo(document.body);

            var update = function()
            {
                var times = function(string, number)
                {
                    for (var i=0, r=''; i<number; i++) r += string;
                    return r;
                };

                var val = self.value.replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/&/g, '&amp;')
                                    .replace(/\n$/, '<br/>&nbsp;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/ {2,}/g, function(space){ return times('&nbsp;', space.length - 1) + ' ' });

                shadow.css('width', $self.width());
                shadow.html(val);
                $self.css('height', Math.max(shadow.height() + noFlickerPad, minHeight));
            }

            $self.change(update).keyup(update).keydown(update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);

$(function() {
	$("textarea").css('overflow', 'hidden').autogrow();
});

/*
* jQuery serializeObject - v0.2 - 1/20/2010
* http://benalman.com/projects/jquery-misc-plugins/
*
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/
(function($,a){$.fn.serializeObject=function(){var b={};$.each(this.serializeArray(),function(d,e){var f=e.name,c=e.value;b[f]=b[f]===a?c:$.isArray(b[f])?b[f].concat(c):[b[f],c]});return b}})(jQuery);

function message_callback(data){
    if (data.status == "Success!"){
        $("#contact_errors").html(data.status);
    } else {
        for (message in data.status){
            $("#contact_errors").append("<p><strong>" + message + ":</strong>" + data.status["message"] + "</p>");
        }
    }
}

function send_message(){
    data = $("#contact_form").serializeObject();
    Dajaxice.explorers.send_message(message_callback, {'form': data});
    return false;
}

function hurrah_callback(data){
    if (data.success == true){
        $("#hurrah_" + data.experience_id + "_button");
    } else {
        // $("#hurrah_" + data.experience_id + "_errors").html(data.message);
        $("#hurrah_" + data.experience_id + "_button").val("Cheered!").css("color", "#F55");
    }
}

function hurrah(experience_id){
    Dajaxice.experiences.hurrah(hurrah_callback, {'experience_id': experience_id});
}