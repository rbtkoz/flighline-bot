    'use strict'

    const rp = require('minimal-request-promise')
    const botBuilder = require('claudia-bot-builder')
    const fbTemplate = botBuilder.fbTemplate




    function init() {
        return new fbTemplate.generic()
            .addBubble('flugchen','Easily make changes to your flight')
            .addImage('https://www.xing.com/img/custom/events/events_files/1/b/8/1053112/square256/airberlin_Logo_1600x400px.jpg')
            .get()

    }



    function airportMenu() {
        return new fbTemplate.generic()
            .addBubble('At the airport', 'Say goodbye to stress')
            .addButton('Health', 'HEALTH')
            .addButton('Recommendations', 'RECO')
            .addButton('Promotions', 'SALE')
            .get();
    }

    function mainMenu() {
        return new fbTemplate.generic()
            .addBubble('Your Flight', 'Easily make changes to your flight')
            .addButton('Seat Change', 'SEAT')
            .addButton('Upgrade', 'UPGRADE')
            .addButton('Talk to a human', 'HUMAN')
            .addBubble('Your Experience', 'Do what you love now')
            .addButton('Airport Info', 'AIRPORT')
            .addButton('Flight Info', 'FLIGHT')
            .get();
    }

    function flightinfo() {
        return new fbTemplate.generic()
            .addBubble('Airberlin','Boarding Pass')
            .addImage('http://www.zylstra.org/wp/wp-content/uploads/2016/01/boarding2-233x300.png')
            .addButton('Yes', 'YESFLIGHT')
            .addButton('No', 'NOFLIGHT')
            .get()
    }


    function healthContent() {

        return new fbTemplate
            .Image('http://big.assets.huffingtonpost.com/sarah-abworkout-005new.gif')
            .get();
    }



    const api = botBuilder((request, originalApiRequest) => {
        console.log(JSON.stringify(request))
        originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false

        if (!request.postback)
            return rp.get(`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${originalApiRequest.env.facebookAccessToken}`).then(response => {
                    const user = JSON.parse(response.body)
                    return [
                        init(),
                        `Hi ${user.first_name}.`,
                        "I'm flugchen from airberlin!",
                        "First things first, is this your flight info?",
                        flightinfo()
                    ]
                })



        if (request.text === 'NOFLIGHT')
            return [
               'hello'
                   ]


         if (request.text === 'YESFLIGHT')
             return [
                'Your flight boards in 1 hour :)',
                'What can I help you with?',
                mainMenu()
        ]



        if (request.text === 'MAIN_MENU')
            return mainMenu()

        if (request.text === 'HEALTH')
            return healthContent()

        if (request.text ==='AIRPORT')
            return airportMenu()


        if (request.text === 'SEAT')


            var options = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'ab16_flightline:4Az8vKgMwOjZHU7DsryP5InoJ19pVCa5'
                }
            };



            return rp.get(`https://xap.ix-io.net/api/v1/airberlin_lab_2016/bookings/1?fields%5Bbookings%5D=passengers%2Ccredit_card%2Ccustomer_address%2Cbooking_number%2Cflight_segments%2Cb_id`, options)
                    .then(response => {
                    const APOD = JSON.parse(response.body)
                    return [
                        `${APOD.booking.credit_card}`,
                        `${APOD.booking.booking_number}`,
                        `${APOD.booking.customer_address}`

                    ]
                }
            )



    })

    module.exports = api
