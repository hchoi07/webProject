/*
`<a href="/posts/{{ID}}">
    <h2 class="post-title">{{Title}}</h2>
          <div class="post-meta">Posted by {{Author}} on {{Date}}</div>
    </a><hr>`
*/


(function () {
  console.log("working?");
  let post_html = `<a href="/posts/{{ID}}" meta-postId="{{ID}}" id="curr_post">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">{{Title}}</h3>
      </div>
      <h6 class="card-footer text-muted">
      
        Posted by {{Author}} {{Date}}
      </h6>
    </div>
    </a>`.trim();
  let error_page =  `<a href="../../views/pages/401.ejs></a>`.trim();

  let postId = $("#curr_post").attr("meta-postId");  //"prop" gets or sets the value of property
    console.log("THIS IS THE POST ID", postId);


    

    function success(data) {

        let html = '';
        data.forEach(post => {
          console.log("post id:",post.ID);
          let Vcount = fetchVotes(post.ID);
            html += post_html
            .replace(/{{Title}}/g, post.title)
            .replace(/{{Author}}/g, post.Saguid)
            .replace(/{{Content}}/g, post.content)
            //.replace(/{{Date}}/g, post.date)
            .replace(/{{Date}}/g, moment(post.date).fromNow())
            .replace(/{{ID}}/g, post.ID); //g means global
            // chain upvote info here
            

            // console.log("Vcount is = ", Vcount);
        });

        console.log("***THE POST DATAS: ", data);
        console.log("***THE HTML: ", data);
        $("#post_container").html(html);
    }

    function fetchVotes(postId,) {
      // console.log("data printed from fetchVotes: ", postId);
      $.ajax({
        type: "GET",
        url: '/api/posts/' + postId + "/votes",
        success: function(data) {
            // console.log('from post.js: THIS IS THE VOTES COUNT: ', data[0].count);
            let Vcount = String(data[0].count);
            console.log('from fetchVotes: THIS IS THE VOTES COUNT: ', Vcount);
            return Vcount;

            // html += post_html.replace(/{{Vcount}}/g, Vcount);
            // console.log("html after fetchVotes: ", html);
  
            // $("#votes_container").html(html);
        },
        error: function(data) {
            alert("VOTES GET ERROR: " + data);
            $("errorPage").html(error_page);
        }
      });
    }

    function error(data) {
        alert("ERROR: " + data); //error page?
        $("errorPage").html(error_page);
    }
    $.ajax({
        type: "GET",
        url: "/api/posts",
        // contentType: "application/json", -> defines body type 
        // data: JSON.stringify({companies}), -> body of request if POST/PUT 
        success: success,
        error: error, 
    });
    $(function() {
      $("#new_post_button").on('click', function() {
      })
      $("#new_post_form").on('submit', function(e) {
        //const currentUser = req.user;
        e.preventDefault();
        let formData = $(this).serializeArray();
        console.log(' THE RESULT OF .SERIALIZEARRAY',$(this).serializeArray());
        //console.log("THIS IS FORM DATA",formData);
        let data = {};
        for (let i = 0; i < formData.length; i++) {
            data[formData[i].name] = formData[i].value;
        }
        //console.log("$$$$$$$THIS IS THE POSTS DATA", data);
        $.ajax({
            type: "POST",
            url: "/api/posts",
            contentType: "application/json",
            data: JSON.stringify(data),
            // beforeSend: function () {   //Include the bearer token in header
            //     if(req.currentUser === undefined) {
            //         return error(data);
            //     }
            // },
            success: function(data) {
                //console.log("####THIS IS THE POSTS DATA", data);
                window.location.reload();
            },
            error: function(data) {
                //alert("POSTING ERROR: " + data); //error page?
                //$("errorPage").html(error_page);
                window.location.replace("/401");
            }
        });
    });

  });

})();



(function() {
    "use strict"; // Start of use strict
  
    // Floating label headings for the contact form
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  
    // Show the navbar when the page is scrolled up
    var MQL = 992;
  
    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
      var headerHeight = $('#mainNav').height();
      $(window).on('scroll', {
          previousTop: 0
        },
        function() {
          var currentTop = $(window).scrollTop();
          //check if user is scrolling up
          if (currentTop < this.previousTop) {
            //if scrolling up...
            if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
              $('#mainNav').addClass('is-visible');
            } else {
              $('#mainNav').removeClass('is-visible is-fixed');
            }
          } else if (currentTop > this.previousTop) {
            //if scrolling down...
            $('#mainNav').removeClass('is-visible');
            if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
          }
          this.previousTop = currentTop;
        });
    }
  
  })(); // End of use strict
  