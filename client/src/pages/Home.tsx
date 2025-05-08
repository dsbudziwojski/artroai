import { useState, useEffect } from 'react';

type Post = {
    photo_id: number;
    photo_location: string;
    prompt: string;
    hashtags: string;
    created_by: string;
    date_created: string;
};


/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK DATA  as fallback \/\/\/\/\/\/\/\/\/\/\/\/\/\**/
const mockPublicFeed: Post[] = [
    {
        photo_id: 1,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        hashtags: "#cats #yes #legs",
        created_by: "justin",
        date_created: "2024",
    },
    {
        photo_id: 2,
        photo_location: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSEhIVFhUVGBgWFhcVGBcXFxcXFxgYGBoXGBcYHSggGBolGxUYIjEhJSkrLi4uHSAzODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAQMAwgMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAIFAAEGBwj/xAA/EAABAgUCBAMFBgQGAQUAAAABAhEAAxIhMQRBBSJRYRNxgQYykaHwFEJSscHRByPh8RVDU2JyghYzNJLC0v/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACoRAAICAQQCAQMDBQAAAAAAAAABAhEhAxIxQQRRgRMUMnGRoSIjM0Jh/9oADAMBAAIRAxEAPwD00iIEQ2ERpUuO/ccm0UMRIhvwoGZcVuBoXSuJKIiRlRqhoboQIgRAohhogoQWMAURqhoIqBkQyQaxEKIM0aUIYCk0QBQhpYgakxSYmKFEQKYaUmBKRF2TQApgZEMFEa8OCwoWIiJTDJTECiKsmhYpiBTDRTECmAKFiIjTDBTESmAVAaI1BqY3AOj04yY0ZcGIiJjyrO6hdUuI0QcgwMiKTJoCvtAfMQwpMDUmLTEwZSIFMk9IKsQJRMWiWLqEDKYZVFTxjiyZJQkhys9QGS7EufOLc1FWyavgdaBLiiHtdKBAW6XqBthiwu9+nn6tXcS9t5aFkAgger2f68x3jJ+Tprsexs6hZG5hDUcTlJUElTqLMkZL7gdLRwPFfawzZ4MtJTSGKfvECxuMXJjntRx5aJtrUqqAI327HYRi/MzSRX0sHsX2pFVLhy+bYLWf6xEzHjh9oSmcFoKkrJclVikqDcrvsTnqY7f2V9rUz0qTNIQUBypRYEOwv6iN9LyVLEiJQo6oxAwDTcSkzDSiahSrhgoPbNsnENFMdSafBAAiINDFMRKYqyaAFMQKYOoRAiAQEiIEQcpjVEMAEZB6IyHY6PSimINBiIiRHkHaDaIlMEaIkw0AFQgahB1CBlMWmS0LqEBWIYmCE9Xq0S2rUE1EAPuTGlkMp9f7SaeUvw1ruMsHAa94889puICctS5SlEXcVFYptcDKBYv5YvCvtfrP5027KrUKSySwJYEAMTi56Z68jM1gRMDl6SbMCSCb5Nzvf5R5urrS1bizWMayFnzCCQkqBtYh/wC14Dq9XWRYhkh8XUABA9bqwoApxdsVN0UAf7vCsrUqSpwz2wPQPCjEbGtNNqnpKl0czFSi9LMHU+w3+HaIcQklM1bEzCCeYBwe+4b94Nr56ApRCWq7WDspmNjf9oT0c4mpISTUGAB3BChbfEaQdoGQVqlrUSrPkAxxBADdKVAg3LkBym5f5xvVEFVKEqyRhgTtyhx1gU2WpJBULn8u3p8odOxF/wCynFhp53vgEliovQALNZypLYt0LGPVuHcYlTm8NQVl2wG873a0eEaOkzAFOEE3bI7fXwj2L2OladCD4YCU0pLqUl1OHKmfds4tbeOvxpvgy1I9nSkRApgiFAgEXBwY00d1mIIpiNEHojCmCwoXKI0UQwUxGiCwAUxkHojIAPRWiJETMRjyUdwIiIEQZo0UxVk0BIgCxDjQFaIpMloquJaoy0FdNTbC0eUe0+tnTFErUFirkCCFJRdNskbjePVtXrZBBQqYghQIKarnLgAXJscdI8h4/qNOV0JSoJFVAagYqYi4y9zl/hj5Uv6eQislJrNaF0om/wDqJISVKdqdnLuSGL4thzFEdOha1CXUsgA8t3A95Q6hvWGuITAaQDcDLuXD+j/3hSfKCQlSCHSAFBwFKcnbyKXfzjDTplM3LlS0kFKnSwJCgwCrEp72a8JJlIIdyMv03YDeOg0Ws0ymQuSKQimxZdd+es8tOD8fKK7UaNLkJwfdHrkE+sXKk7sEVk9VXklx1z+cTEsoKVJYOHCknGQxIwSxt3ic5VKaE7+9i5v6tcfnvYytMqVJqJAUokNUQqkj8LWyTl+2DFxysAyc3i0xSqyA6QwYYvk9bqJcv+UIaqeFqKwClT4BJt1c74+cYnUKdwbqDMm3xG7s/mSTeJy6l8ktNw9kjOXqPYPf9hDtvAhdLvVe5urbufm8PqlJpBRMBVdhU73AZIyPW56QquQvm5WCbljYC29+ogKEAmzAdTYevSBYA9u9iOLJmykSa1KmpRUskdyGsG6N2IjpvDjyD2fQuVMSkpCVy+fkPOXpNB/EGINn3Jfb2PRTvElpWzVAFi9n8wD8o79KdrJg4qwfhxhlw1REaY1sKFfDiJRDZlxAogsKFqYyD0RqCxUd1GRuMjzDrNNGiIlGoAIERT6ziYRqBLNgU3ewdRsXPkoZiy1+tlyU1zVBKQzk4vHBcb9rtKZikqVcoIlKSy0LNiCVMQDlLg9fR2JnJfxA1vgz1mVyUqBBGS4H3h1BG998tHDL4gosAk8ygau13HdRMWvHeLTJiwqYULKOQJpCQGs/KWJ5QXzFRqmqJA943S4pB2awa5jkdSYwB0hmVTQXCVAU3c9g4t0hGWmpSrsB1d7k9PWL2WoollBuMktzDO+Dj8ugim1LDmS4JACgbu2S5HbHeFBu3/AOiEuYALXOC+O0QVq1gkizeRviwNs9IAJRUHBDef6dYEpDDa8b0SFM1ajVcl8gDL9RvYxLXauZMIVMKjysHJ2tZ/KABwMkB8Xy0bM8szvn5/2hgYZRarq5+GY3KTcMX3ZrW/OCTkEEM7nI/CSWIPckE/CCI0q5cxJJppI5lAKYjdrhQfzHpDAalTgK8ipN0KSyagXcXOPQ3hRI5izm7WfKsDDvi0F1PEJynKlEgqCgS4IIuFJINjB1plJloW6jOJdle5Te9mJuPiIp5AvPZSdOVqJMqmq5TQsJWKaWOcEZ827x7NwTSqRKAUpZe7TAEqSPwskkR5x/DHi0r7RMOoVKQsJAQVUpuLFiTlhtHpHBuMo1NdIICFUgkjmGygAX+MdGk8GckPUxGmDRBRjYkG0RWmJkxArhgDpPSMidUZDsR2UZGoyqPPOkyNExhMRXgtnaHQHK+10ibOqQyTKQHKAxWskNjIsot5eo8p13s3Mmy1KlpJMulRl0ULCVEh6TexDb2I2j0SVV9rK1SgJtRQJqFLVLJUWCVSykYfqNvKOY1/tZOkqnFcx1LKkXFKQlJJswIVYAA9Fb5ESiiTzPUyVhZyGqNgz0uSe8IrSooKycFiAOxv8AMx2Gu4zJ1IUkgIUnCAaEmlLOSSQVVOQLZPWK7heh0q5igtavDVYEMFVOAAKrF3TlhkvysYSGc8qaVkJl1b97fQiKVBNPiIWUvzbO2aSX269vVjUcKKCrLVAIWCKRfLb4xaJ6nhs5VRMok1ML9LsEliQR622xFJJCE9bqkqalICUgAOLnzOD+Yc7QNUz+WQCwcBSSoOTb7rOQGd/ohTLKVcycHmSeXzf8MSCXqUKUsLi5foEuOrb/AKwwGpPDytmUE1BwFkuWNwA1yKqrnDmI63hwTKE1MyoVCWU0lJCmUd8tTfGR1sbhBBMxSyCAgJdQel2Dp6EAN2DiB6OYEzE2dCVVPSkqLFmS5AUcH4wABnyAAlQWSaUlQYpLnYH71ty3qA8Em68rWVqdbt7xJLhrv6Q1LlGYvlJpVyqIQlk4LAhgb7uNiwdhqVwtaQm1JmMlNXuqdi4JDBrB3HvJ63qmAnO1ylW2eoDZ+/8AYQGUs1Cw7DZ/WNz9OoKKVAApLHvnHUW/KIFSdnFhu994kC+081HiUz1JALAUgKSg2N3NgFC4B2Nrx71wcS/BQZQ5SlIBs5ADByMmPmVSiS+8evfwu1orMmVMPh0hRlzFCoK3oLXAAwG6tvHRozzREj0gxExMxEiOlGZAwN4IYgRFCNVRkaojcPAHZRopiTRjR51nSQjRJiZTGmh2FHm3thwmeqeubKQUoQkqXSVAzGYU8hBDgkvdm82831nDVrICpLTJsyyyaQ9+UGqm/l16GPozUJdKgCQWNwzj42jxf2i1moq8OfKVORUShwKkEqJetLlFsh7sdoznSEji56RIWaUl2WHALgqDAMe++fXNUvXkVAFgQEqaxUnNJB6t9OYv9bJFJSQoAEOVEqSOhLXz1d27vFBoEJV4iW5gkkKIF2IBZ2Iy/wCkYReLKNzuJKJCgS7i1Vxg2Lun4jEH1PGlkFjQkslQvj479H69S9MtAFTg1OGY2Au/xtAUrJVf5N8usabUyS71ShMQ7uchQAcucEA8od2foIqlKpUD71/jsbRKXPWVEJvUcONu7hrCAT6lCoj3WFzgOWAHS/ygUWhhfFDGWA1yan3LC4w0PzdAJc2ugqloWErRVSo2SsotzJ5SzsWPwhPgE2WmfLVNAKAsVOEkMQRhXLYkG/QwTVax1nwlrpSpdBJuyuUmwASVJCXAAeL4QFvpuLyZRVKCZhlKBqoCASQFgKDgvTUSKnNz7rRTa6UuozP5hC71KqdQ9dmAGTiLDhXFFS5iVLlJmMTeYmoPhyFWDVZ+YzF3xX25mTEJlGXIEullvLBUVCpg4sGBszM5xaLWVlknFKUpbkqe5JqO7XLnJPneGpellqSkBRSq7lV0lQ+6mwL3HW56RZcK4fLmkKVJWZbmuhRBDh2SKSbAg3OxvtF3x3gOlTKUEqWhaWWKybAhJpUmhwu/a5ZrQRhaCziVSW+IHk+Pyj2b+EellnTmeEfzH8NSuoSXAYWta+flHlszhEwAmXLmKAAfkLGoOFO55bHmxaPRvYL2glStMEJQKnqms4KalU1KszBCXzsewjTSVSyTPg9KKoiVRFKnuLg3EaIjrSMbNloiTGwYgYYWbqjIjGQ6FZ2JMZGzGjHnHWzKoyoRGEuMa5MmUqYrA+HqdhDoVjP2hDPWlnZ3DP0fq8U3tJwSXq5dCptKUuSzEO299mdo8t4/rJqqgkqSgKqplr3wAAKij3W5W2N3ES0vtmRUpVSUzKgqTWpSA4d3U5c8vTf1yepHhjK/iHBUAThp5iyULISFoPOlRYBBANQqaz4PVxHCaqXSlikhQJHnhv1tlhHZcQ4lMWypaxcPzEgp2SMuohgxbIvvFFr5RUpkhwKQXOHFmYlxu/bdi+F5Gcypb2vD3DeEzVzKUUuPeUVClIPU+T4v0xFqmVpZcxQn1ABB9wZV/tGOzm2TaImZ4lP2Zf8AMNIILhSylgCXOeUFg/5xvFqrJLCZw/TeANOyVahakKVM8R0lIFky/wARLkN0az2ig4qtAIlJAYPSaFAJUpVX3i5DEgPtTYtDGo0AlsFLPjAAhCTzMUlRLqdJCQLgHPkSBazgc0S0zCFOqwl3r5SE+7c1Bw6WDP0xo7fQiknAZqckl2Hz9bxktTCMVIUBUUlnZ9nZ282vGpNN6twWbY2v8m9TEDsNInqRzJqGxL2vsfNoCJhcE3aJyp1BcUna49HHQ9+8bmkg8osoOAS7pf03BEAFzwv2mXKBZ3IAs6WDg2pIpIIs3eLaTq9XPK1SpIUFkBi5uTSAAS5LPjYnYseMAe+/RrRf8G45N0i+VTpNiHYi4UOUvSp7uQbxcW+2Jo7NUjXzpMtMx0hRFMsUJWhKUhAGxKGWxCj2JFUWmh9gJ0ueCFyfDNKlGi5pKSENu5BJL3OegsP4aqTMC5pmrmLWSo17EGkrCmvUKLbN5mO3mqAyQPM5s9uthHTFJqzJsEEABhYCwbpGiI3InImJC0KCknBSXBiZTGyZDQEiIkQamIlMFioE0ZBGjcPcFHWxpolGR5x2EI4b+IHGNRKlqSJA8M/5hNg347sAp2ufMM8d3AtVpkzE0rDhwWcjHlmFLKFR82cU0k1aEKllSbYJLnYhXQCwc/iZo5nVeIOVSVOThiOYHZ7vaPY/4l6GVImPQkIUkAOTS53pBAQygL/pHm+oUiY81BDIS6ipzS5CaioDJKmbffthw6GUq9QoSylyHyFZOA1wxx+VoenJ8KXQ5Krl9yDcAehH7QLUaOUmXWXVU7MUpIUzi1JZLX9PKOi9itHoDLUrWVpDjnmKaWS/KgKsUAlJKjf3FXDMLcLCxKV7MsgmaSlaxyCcRJu5KQCp3JCV2cM18GAz+GeGFeGuUQxYhUuZMrvSEhBUosASVAWANxmLed7VyZapaZcuQigJq+zhSASnmIWJYCZhKwLggcoPSOa4x7TaiatK1TVqsHqxZuUg+8nlBYuCX6mLwBbaPjulTKSE6dKphJE3xB4lSAzOpQqNhgML9rn4lxyU2pl6ZCJcmaE2SgBKVEFEwICkmhK0tYEF0kvaOTka5I8UWIWOVw9JDtS+Mm+fW8GnhSmUOYgJAL4yAQ5JOCXx0s0Jya4FQjOl8pJcl8jBF7nd3v6mE1ILB/TyfPe7/CGtRqlF3yS6juTdzlozT6aoOhK1Fi7DfZm2DiBWIBNSHYBm6l37v3If1iMtbF2dum3f5xZ+BMWhNaeQOUqCbJcspykWDjffpC2n0hKgBdwdwACRl72x9ZYCz3YKy2bfH1h6ZIAShT1Oblw70pJSQ72cX3cwkqSxYgxa8FMhleMC5YJsSLkEuxCgwBx13xDQF97Ge1StLqbJUZayxRUQACGBu9TO9/lcx2n/AJQvWz06dKUqQpgpJAZ3BwouFABVw25wI5H2j16J5T4UvTy0S5dgmkFZpJUoKbcn3SwLhxYsT2Q9sJWjXMcEhSUpRYkoUAXeogdjiNYyrBLR7Vw3SeHLSg5Hlv0a0MmOU9jvaZc7Sqn6hSCqpwiWOYJIcCnJtjLiOsjVSsiiBMQUIKYiRFJiaBUxkTaMh2KjqIyOdm+22iT/AJz/APFKz+kDV7d6Ef5p/wDgv9o4zpOmjI51Htvoj/nfFC/2iH/nOhcjxjbehbHytAAf2t4UmfLCVSjMSLqAVSWBBs+/qMR4Zxv2RWlCZklilarywSVB7pCbDxGD3Sb3do9wHtloSP8A3CQ9mUFD8xHlP8QuJ+MtKkpFCKqVSykciSWb7z3BZsk+cZai7A4zU8DpWECWolgVGlRKXLOzhgBm1iD6a41wDUSQPEmJUkH3AS6SBilQHMEsWFwCHA26jV8aWJgCJ6QkXNApJBZSU11EqWCEhwWdy7Wim1/FCqbVOlhdrFyEZDEixZqWSVBrCBPoCl1fgrSBKSoLJAu1yAAwAvUVHctjvFpwH2ekz5alXKkByKxLFyUpS6qg5PR25u0WXs7wo6mapKZsuSEsy5gSASCS4D8xABU1xbIs9NxJcpCZsoLdYmHnoKULAthNnc1OpgMOcxVgI6TgoKphBmIMtFYHhqqUtjyORyEgVAny7xZcF4FPvJEyStE0cxSq7UrpNUyXyI5SpwLBi4hPiHE0lQKFGYoyxKX4yUJZgkAkiorAA5VEggAdhCmn08s0prBFQClOyLE81wTilmAc9bQwFONTUcstKWVKKwogu7qqCdrpuH3+EdJqOFztIU6cpChPpBouaiZZQKgCQoKmp5SBlmIU55XiemKJlCqmSW5gQQHNgDHTTdZM+0rnI/nKUAkAEKqBACQSkqSQKgAKizAH3YaEWGp8c+DLmUFAcpUlgoipKgkAEJYJSgFJ5RTtaFOMaDw9QkpTLeymlKJDMoGhZACjcWyDSMF41q1y5qfHRMSl3UWSVTEllEJJBYC6iCS4PwhPRTjMSlSJX2iYn3kUrJCATQxCvc572AdvOHYUWXtd7KTEqC0S0AzAlZCSwIULEJIqQkCmxZumY5TRqpJlqUySWURhnYnGzvHbcQ0VOl8VU9p8wVUhdbIuGCkLIZKnGC4ADuDFJ7J8VVKUpCkhaFn+YF2SCHyCQHZwL7xLYUZpOBLAJT4UzcAkWDkOoKIZNgQQN9oW0qEIXNEySVVJKUgKCSlZFQLlywGwF2DxfcQn6KYEiSlUq7zEKuCoBgUl3LpJySXfrfpPYHScOQpSps+XVMFBRMKaWYABK1EqHvbl3FjmGnYUV/sT7M6idL009lUKnOS60qoSxrBWoCkmr3Wdt7CPaBK8/PeF+Hr08tCZUlSAhIZKUrB/VzDfiA4ik2FEDLiJQImVRErh7mFI1QIyMrjINzCkeG/ZZv8ApqfaxjStFO/01fAxezkIIu5bqpX7wpM1CWBS7W+8rrcZjzV5k30WoFYrSzxiWr4Rn2WfbkV3hnTz0qSkqTcgEsVNcDv0h8aWUblIJ6up/kYcvLkuUDhRRTdHOP3FH0MRGkntT4SsvcfVovtMUirlZi2T+8TMiXbkHz/eE/NfoWwoUSFJHOkjuzHuBFbqpC1kgKTVf45a9stjr2jq16OT/ppv5h/n3hf7LKUVpEsJKSEhTq3Sk4f/AHYxaM/uLbk0G05aWiakMtLsp3DP3Iexy0V+s6lKkqN7szFwT+npHaf4SgPVv0LP/wBntYYjEcGkG6kP2cn4377NF/dRCjztMpR2Uels/vYv6wXSyJvvoblu24YhrZyQ3lHoUjQSEghKCyrEFR6dH7CDKkyzZiHuWUb+d4b8xdIKPN+JyJgWEzAyiAWtubRKZJnJNJS5HKN6XsGbHaHdXKCtawdvFQnN2BALHqwMdmNNLYAkkG9lK2w98YjWfkbKvsKPPpPD10lSkWum9mNg3UG8CDpcANULf06Yj0SfwySr3gpi3KVqI64JMa/wvTqFpY5bDmUWbbMZ/dr0FHMezfBphUFqAocVdSHFQ+AiWv0lE80IIS5sx8sjzHxjq5ikykFTEgOWCj8MwOVrZa1YUFBwHJBYsSxCsFh8Ij68m91YKrBzeo4UpAqpLKvZy3ytGaThE1YqGD1/tHXISlW5v/vV/wDqIp06GGQOgUofJ4S8mS6FRQL4RNIAYADuT+kdH7PcZ1mkQJaClUsFRoWLczbhiACHAB3PoFWll3NPe5V+8IqWApgkNlmfsz+nzjSPkzY1A6HVe1WuXNlzAkICMy0khC+tX0Yhxr2q1s6WEJQZRF1KlLYq7E2KR5HpFRJKAkVBLnyYdn6CCp8M4CTA/Jmug2lnp/a7WpQlJl1EAAqKg6iAznuYyK4pT+AfCMifupehbSuROXMqNTDAByrZux84EnTTAFOrLnBYPsTgWixm6NJFJ36Fsbm3n8YiJKrAIQQ1nsAMXO+THOtY0spdQJz0oTbam+Nz2YRYaebOSGWoYAYHr1tDM2XdvDBOPeAZ7GxLgZETOlBYlmAe4BADbdnEOWraygsUnz1jC0lR2xtApuom0BlArYul+hPxLNiHl6CWTzHGAUtdjhjA52kkJ5ixPW2fKEpoNwnM1E4ICwHPZj84hp9TOFSylqiM2uAA8WGpUgD3SUgWKTYm9iREETEt7iyQwZRta2cfRilLHArF1a+cbhCmyTfB6RA8WX0Je24v+8NomEmhZSL2pLH4EdoOkhrhQAe7u57dyYe5eh2ijkcUJUrp1Yk26QRfFWGfhc+sWlMspcBZCrvS9mfb9YXlyZBfIPkxuwvZ4e+PoLOXWp1BSHCgqpxYg5f4xYyOMKSHKnPf4RZzeHyWyryDDdunrEE8Ik7KUo5OD8fraNJasGskFfreKqUHGR1w5sGfyeAaTjSkBim5Lk7n6MWg4TLLkLCuzp3wLB/owtO4Et6gEg5Z/wBWhxlpVQOwc/i7hVWCLZsYh/iJd7Xs3me8HRwUtdQfoL79doFM4aguCvnHdiSegN27xSlpjthZPGCXazfXrDEni5u5JPTp3Jit/wAGUbJU7Zvb4xFHDCxNabXJqsMC59RB/bYt7LhHFQUk1Ps3nu+3l5xAcRSRY43LE+Qba0UOolHFRI7PGpWjXgJVd8B8etoeyPsf1H6LHVTvE5ASNn23N7wsJ60Pz3GGu56j5wNOinCwSr0hdcmYMpV8IqNdMlybLdGpnkA3vfEZFcNNqNkTG/5H94yFtj7QtzO28IKI5QoWc1E77l+jwKbp5wcpVvYUlWWa2BviFdVMWmyKAtuWzBLnDxudxOYhHMlywYtnbzvHnR3PgoOjTrAqnlBOEs6SxybDMGkyxlLAO+/xbH9XhCTxslIMxGRgjfs4Y2H5dY3q+Oo2qFLFTBrZ36lopw1Lqh2OcR00uxWooGWY2fFgO2P7wh9mSeUOs9TScW904hWXrlT3BYBIc1OLdWPffy84MiUscyZqX2YP8b9IppxVCbGZXDUBVySQaiBygd/VwcbRPUpCSV+KQN+ZgD1uMu2LZtFevVTcTEEjAKSLnYs8OaWQUfiYh6SH2s/QgW3x2hytK2wNzzLVSqpL5Puu7AZfH9IHK06VKJE3Dggc3Qj8suc/FzWz5Mtq0JdiSWBHd2Hf4ekL6OdKKWQEseiQHDf0id0qtAEVNQhLKK1AAJqPUDbDXPwgchMulpdQbdVRZ/vOT2OIdJl0hSklIwEsab7n1cRFM9AHvJCbuzbMCWHY5iFJ12VgEUJCRdSlGxZyS7WbvDRSlqbgNspmbZ36E7frAJeoSkuFVPsMC4veENXwqsuJpS5J6nG237Q0recCGFzpaVCkKBOaShy4A3vBhLBuSRvzFv67bRXI0BlA0qC1M4JDbE3ffEQlVrYKS53FQIHRvQRTjjDEW05fLyqT0YYF+mC0KSpALjlc5NyW8zZ+3eN0pRYuDYWFgS9n7N9WheYVH/UVdmSlh5EvYQooY1PKUAhISd72fe0Qm6mwICAMHlu3S2MPnpGjIU/MsJSHspi3Tt9ZjAZNFKVXO6TTe+wxkwL9wBabiAUqlMtLJ3ZvS/mLd4anVM6ckZsdxt1iOlpYgGxxdzft8/WBCRmk+pPy9HgbVgSnGljNUAMBxzX3f62iHihSk+HKK0n77W8zAk6SZkqSrLCxbzJ/QRKVNmOkKAA6A3fyG3eK6wKw6pK3+/8AAfvGoAEL2RbbnH7RkHyA2qSgvQa1KIJUpi5FiW2FzBVKKC1ebABPUgOOvl3EQRqdrOLA7f7na+Y1N1CqSUmWZmbfhBy12Pu/Axmm26AJO01V5qUU5dZD/exs+GfrAVyZKbBNKTYNfBt1AyDcti8UulRPn1VEhJ3VYquAbns584sJejKUhCZqSAbuTvkA+kbNKLpyDkF9ieZU1QF2D83mS1t+/rG53DpXK5WkBnRLuxOKul36vfpFnL0STc0ltg1yGy/l8OsT1E4hJtsLJIqsS7jazRP184ASl6pCWEqlwm7uVhyeuS7D6aCnVqashSSeqVEAAsSwvl4zxCU1JSAAovUQHU4fHm5PaF/tCFLYlbhgEuaQTc+Z/VoT2voCcyshyzO6sDGM9oNLmJapwWLE7b3xdztEHcvakAFs+rk+cHRPSo0psU4BFm3vEOXoCPghVyv+mMn628oFNRJSSeUW94i2G3ufeb4waecimq+Be2c/KFlaYLuUEAnuLjB7pYw4ypZGZL0iAl0JZ7e8XLuLdMj0iq4loJhUBLW5GAMpyQ5DXbrFpptIlKXcscORs1z2+jvDKkoS5JDkNtVffPR4qOq4ywKrObl6DVpVzOcOCR8+kO6PUTUuBLHfFj39Isv5aASSq+zWts2d+u0MTdQlgwszWN/Pb6aKlrblwKirRKnqCSShj7wNwQQ/qqLDTqYKrUCQbMXAz3vtGK1SSLkfk2L4vAFhLEAWvuSG2v8Ap+8Q25AQnFK7rNV7U5Dhm+cYnhqMjl6WuxJ+bxK7smhQy4JG1rWY7fvESoNSVgG7nBF/me8NtpYYEkITLBJVcte7sHtbzjR0qT/mKvtdr+uIXOmBDFSiHp3Z9x8/kesFOjS9RBt0x69YPkCZlIQm5Jf7wtcucbQSUzhKUhzcOc337wGYAizdy774t6wVCVFWGYMD637don9Rhr9vhG414f0/9YyFgKFtHw+gFIQs3uo/mDv/AGhfV/y1BITQ5sblybgOPP63s0TaBUpRCAkWG+2OxG46QiPaGWVsA4BsSPryhxc5O6sRkvVFIIUoGyaTYEvu3W243hkSUqSAlPu3Bbc/m5ItC8vWBS+WUggi27i/X/j+WHi0E7mDkBmfts/m0TO08KgK3T6Uyybg4BLl9y3m5+hGSdOPEuo1kX6FuwwHDQ3qAk2AazqJZyWY/t8IrJk0pB8Fb3YBWbgOBbt8xFLdPjkbHl6hJIQBfq/zq7XiOm0KbdXNzsXPSwH1tCEiTNqqKUi4DPsXwfTMWkx0BRBHZhvt/wBs/OBpRVJghoyUJLk2G5s/0/zhTUz0hJUKdg+zmzW9ISVw9Z55qyBcPi5fA7u49PKLDTaJKQS7pABc4e7kPdmSfVolwjHN2FldMnLUFF7lwKXs19u6QPWBomTSkhTFhYXd+9up/Pzi31U9CEMQ3drAhiSSL77PeFJksqahQFX6Wv3ct2vGkXjgTTKfU8RnIIdFrMCNvrr3hnRa5M0laksq2bMBax2/rG1ylA5KlFViC7s936Wb0MPS9CokBISAr17OSAHdu/bMaScK/wCiMEyUqYl1MQHYM2QXU77fV4D4ZdRcFLBh1DWA7w8NCCQxZIJUogAVXfzItB6gHoAdskWYhmcximuEUV2l0i+YqQDbYHJuw9DfZyOkZJSsty0l3ubNZsZbm7Yh2WglzMX5spNm2YYF8jp6QrqpoQlwS+D/ALru7HFtoum2IjNFRJTgkfiDYwR2/PvAPsMusLKVWuOZku4/JoBL1S1mkiynDHFqS9/MZ69ixnKbqH/EZan9LjENpxwKx8ytx1s3e9vRoFNnCqkIJtnv0+UVaeKTVEhmyMNba3yt2gyNVMAx0DepdnyAfzhLTl2OxnUalYZJTckON/oRFWrJB2YEnt5wLRoXXWpyeazhg7N+ph2ahJBSoE7kdbD5ZgainQCf28fhVGQ8iZYciMbu/wCcZBgMiM8TVsySEqGzAq2Yk3YsPSNfZUy0ioVLIqZmDAd9rQwniCHClYDsHzjbyfPUwKe0wl1BHMQQ92DP8Wx6w7fHCExGXxU1KJQk0OBfc2IHw+UN/bQSkkklSQrOHSPhcmAgyQyACohwcCo9T0G3lEdJSoqmLTjlTYFwGPlY7940cYtXQ+DNRNVQEjNyS++zdDYWHUdoV0VYORhycMybZ9LttA5k5SRyJNLkm3X0uPqzwtp5ihMSkk8xswa56g7Z9I1jp4YmzpZfFkkBNqsu1h3YeUTPEQxux2I6Wdg97QqjhyUi+Te/bc9T27vC06QHSlO/vVF7vhvI/KObZpy4C2PoIUpK1KsH947Hy8vn5QWfrQEVEbmwtYXLXbqG7DtFXqNEWISrmIYJfDkvvclIMFQiYAylJpDgDe9nIHaG9NNIZBPEiRUoFm9L8uerRBGsSrkSkkk+hGwcXy1vLtAk6hC0KBAeoIYdkk1W6kD5w1KkoBrNnszW2JxjJJN/R3jXbFYaFY1w/ThrnJDh74u3ne+Ghtbh3XygBLC1xkDtn5dIVXPSoKA5RUSBsdqiGy1r9TA16ijmSxL2G7k4YY/pGMotlWF105IZXMBzEm7E9u8L66suhGxaosCTbrbDxNhMepiwtU5dQYsA3btAUAKw6XIfcukXfuHzFpJUSARp5qUc8y7Eku7MA9xk4wesEmpZgVOaAXP4mdm/MntAtbPZOabgP1sLeTv9PAtMSsAlTC6anZ8Un9e8aLc8sRr7bNQspcFRNmALl77s1sRObrpgPNfYs2MmGNPKZQCCGs5s7nrDXiSwCAATvcdNv1brBJx4SCrBShVT+FwSSNx0G9mgkzRVTQVMAOXqbWa1vSFTqDNISlTAWt1/aDz5qwAiWgrOHL5DFw2RneIad0hosZctKQQgGnAPXa3aBLYOGLgWcv6H++0VsmbqXcnlTi7mw2taDTtesFgL2ze+T+/pEbHdIGyJ1ChZ1fX/AFjIR8aeb1C98xkb7WFgdYGdrY+bQ0UCpCWsUrJHUhCSCfWMjItksBw9A8IHcnPr/QQ9KLymOLf/AFPrGRkZT7/Uf+o3oZCa127fJ/zAvEZCABUBzBJL+ojcZHPbsfQrrpqglRBL49Ob9ozgsxXMai9D5OQQAW8iYyMjeP8AjZPYLT3mh9wr5Yh3VoDEN94D0Nj8jGRkEvzXwNFHJQAogBg6Ra1ihz5xacRSEy5RTYkD8gLdLdIyMjWf5IaByDUhzckJfu6Jaj8yYsU2KiNirvhwM+QjIyObU/L5BciujNQWVElrBy+QXiKTZuqkA93Vf84yMjV8lANbISZhFIy3oKohJkJ8NIbLPc9oyMiuiOxKVZcxn33PlDpPKSb2Bvfr+0ZGRWp0AzM06UIBSGNIPr1gkpfO3+5IwMNiMjIzRSMmF1MSWKg42uDt6QxrPdCdqhb684yMiJ9Agh0qPwiMjIyMbZJ//9k=",
        prompt: "leo vel est. Mauris ipsum elit, porta vel felis id, aliquet vulputate tellus. Donec tristique est.",
        hashtags: "#nap #kitten #basket",
        created_by: "anthony",
        date_created: "2024",
    },
];
const mockPrivateFeed: Post[] = [
    {
        photo_id: 3,
        photo_location: "https://thebutlercollegian.com/wp-content/uploads/2019/11/Short-people.jpg",
        prompt: "NO ACCESS TO BACKEND. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        hashtags: "#ew #pad #siesta",
        created_by: "alex",
        date_created: "2024",
    },
];
/* \/\/\/\/\/\/\/\/\/\/\/\/\/\*MOCK STUFF END \/\/\/\/\/\/\/\/\/\/\/\/\/\\/\/\/\/\/\/\/\/\/\/\/\/\/\**/

// data: JS array holding post objects.
// expec 

export default function Home() {
    // tracks the current feed type (Public or Private)
    // "Private" by default
    const [feedType, setFeedType] = useState<"Public" | "Private">("Private");

    // posts to be displayed in the feed
    const [posts, setPosts] = useState<Post[]>([]);

    // handle switch from public and private feed
    function handleFeedSwitch(type: "Private" | "Public") {
        setFeedType(type);
    }

    useEffect(() => {
        // attempt fetch posts from backend based on feedType
        // if fetch fails, fallback to mock data
        async function fetchPosts() {
            try {
                const res = await fetch(`/api/feed/${feedType.toLowerCase()}`);
                if (!res.ok) throw new Error("fetch failed");
                const data = await res.json();
                setPosts(data);
            } catch {
                setPosts(feedType === "Public" ? mockPublicFeed : mockPrivateFeed);
            }
        }

        // TODO: real backend integration  
        fetchPosts();
    }, [feedType]);

    return (
        <div style={{ padding: "1rem" }}>
            {/* toggle public and private feeds */}
            <div>
                <button onClick={() => handleFeedSwitch("Public")}>Public Feed</button>
                <button onClick={() => handleFeedSwitch("Private")}>Private Feed</button>
            </div>

            {/* displays feed type */}
            <h2>{feedType} Feed</h2>

            {/* scrollable container containing posts */}
            <div
                style={{
                    height: "400px",
                    overflowY: "scroll",
                    border: "1px solid gray",
                    marginTop: "1rem",
                    padding: "0.5rem",
                }}
            >
                {/* maps over all posts & render post details */}
                {posts.map((post) => (
                    <div key={post.photo_id} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "0.5rem" }}>

                        <img src={post.photo_location} alt="Generated art" style={{ width: "100%" }} />
                        <p><strong>Prompt:</strong> {post.prompt}</p>
                        <p><strong>By:</strong> {post.created_by}</p>
                        <p><strong>Tags:</strong> {post.hashtags}</p>
                        <p style={{ fontSize: "0.8rem", color: "gray" }}>{post.date_created}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}