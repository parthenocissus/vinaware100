import cyrtranslit

t = cyrtranslit.to_cyrillic('engleska je u tom trenutku bila strašna lica, koja je, vrlo mlada, vrlo dobro, mogla bi bilo, čak i, da se, zauvek, rastaju, a da će mu noga ostati, ako ne dobije decu. ona se, međutim, pojavi, u njegovom zagrljaju skoro sasvim. mladi su ga, dakle, i, u londonu. kad stigli kiša, u sobu, vide da ih i sela, i da se iz daljine. a kad su se vratili, tako, da je više od godinu dana, ali da je njegova žena i rekla: da je to bila, da je sve uzalud učinio. osećao je, začudo, da je, u tom trenutku, osećao kao da je, i on, mogao da pokaže svoj uticaj, onih, koji se vraćaju na more, čak i u more, kao i nebo, pa i u njegovoj, i ona, polako, odlazi, u svoju kuću.')
print(t)

t2 = cyrtranslit.to_latin('engleska')
print(t2)