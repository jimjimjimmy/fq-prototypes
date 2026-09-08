# Session 004 — CDC Connection Flow — Jake Hickey
Date: 2026-05-15
Participant: Jake Hickey (Sr. ATC)
Study: Connector Setup — CDC Connection Flow
Task: Using the provided prototype, walk through setting up a NetSuite data connection in Data Studio as if you were a customer configuring it for the first time.

---

WEBVTT

1
00:00:48.440 --> 00:00:49.750
FQ Kristin Johnson: Good morning.

2
00:00:51.070 --> 00:00:57.739
FQ - Natasha Clark: Forgot to unmute myself, hola. What's that? I forgot to unmute myself, and I said, hola.

3
00:00:58.190 --> 00:00:59.680
FQ - Natasha Clark: Oh.

4
00:01:00.430 --> 00:01:03.690
FQ - Natasha Clark: Yeah, the beginning of the thing is all set up.

5
00:01:04.349 --> 00:01:12.609
FQ Kristin Johnson: I did a refresh, I'm like, hey, look at that. Although I was noticing in my comp, like, that I thought my image was higher up on the… on the…

6
00:01:12.959 --> 00:01:16.169
FQ Kristin Johnson: Like, it seems off-balance, so we'll have to have them fix that.

7
00:01:16.389 --> 00:01:18.039
FQ Kristin Johnson: I think… Yeah, it, it…

8
00:01:18.820 --> 00:01:22.029
FQ - Natasha Clark: It was… oh, you know what? I might be able to fix that real quick.

9
00:01:24.950 --> 00:01:26.330
FQ Kristin Johnson: Hello, Jake.

10
00:01:26.590 --> 00:01:28.159
FQ - Jake Hickey: Hey there, how's it going?

11
00:01:28.160 --> 00:01:30.579
FQ Kristin Johnson: Good! Thank you for joining us today.

12
00:01:30.790 --> 00:01:33.039
FQ - Jake Hickey: Of course, thanks for having me, I'm excited for this.

13
00:01:33.040 --> 00:01:48.869
FQ Kristin Johnson: So let me give you a little context. There may be two other folks joining us, there they are. They're the product managers for the Data Studio project, Alex and Rebecca. Natasha and I are designers, so one of the things that we're doing, and we've met with,

14
00:01:49.380 --> 00:02:05.430
FQ Kristin Johnson: Lilith and Victor and, Kira already to help us look at some other designs. The reason we're reaching out to you guys is our goal is that, you know, not only is this product usable by your team, but ideally to our end customers.

15
00:02:06.180 --> 00:02:15.880
FQ Kristin Johnson: So what we're asking you to do today is help us evaluate the, like, how effective and useful these designs in the flow is.

16
00:02:16.050 --> 00:02:30.780
FQ Kristin Johnson: And so, what we'll have you do is, I'm gonna share my screen, I'm gonna give you control on my screen, and I'm gonna have you click through a very limited prototype. It's like, it's like PowerPoint slides stuck together, right? There's no… there's no HTML behind it.

17
00:02:30.780 --> 00:02:37.540
FQ Kristin Johnson: What we want from you is kind of that open, like, you know, just…

18
00:02:37.550 --> 00:02:44.409
FQ Kristin Johnson: stream of consciousness, like, I don't understand this, why is this like this? This is the question I would ask at this step.

19
00:02:44.530 --> 00:02:54.420
FQ Kristin Johnson: with you considering not only acting for yourself, but then also acting as a proxy for the customer, because again, our goal is to make sure that we get this design right.

20
00:02:54.420 --> 00:03:08.449
FQ Kristin Johnson: you're, like, we're gonna let you struggle, but that's the point. And again, we're not testing you, like, we're testing the design, and you're just the one that's helping us test the design, so I'm totally starting to put you on the spot, where it may feel awkward, we're like, I don't know, what would you do? And you're like, I don't know!

21
00:03:08.450 --> 00:03:16.550
FQ Kristin Johnson: It's not intentional, it's to help us understand where the design is failing, and you're just… you're just the unlucky guy that's helping us figure that out.

22
00:03:17.570 --> 00:03:18.450
FQ Kristin Johnson: So…

23
00:03:18.450 --> 00:03:18.960
FQ - Jake Hickey: Good for me.

24
00:03:18.960 --> 00:03:21.890
FQ Kristin Johnson: Kind of the overview of what we'll be doing.

25
00:03:22.260 --> 00:03:25.109
FQ Kristin Johnson: Do I have your permission to record this session?

26
00:03:25.500 --> 00:03:26.310
FQ - Jake Hickey: Yes. Yep.

27
00:03:26.310 --> 00:03:34.789
FQ Kristin Johnson: we just take those transcripts, it helps us, you know, again, parse through, alright, this is, this is, you know, comments he had, these are things we should change, it just makes it easier for us.

28
00:03:36.440 --> 00:03:50.420
FQ Kristin Johnson: I'm trying to think, there's one other thing. This, this prototype, compared to some of the others that we've done, this one's very limited, so I might have to give you a little bit of guidance about, like, scroll here or do that, just because it's, you know, again, it's very, it's very bare bones.

29
00:03:51.620 --> 00:03:56.400
FQ Kristin Johnson: Anything else, you have for us before we dive in?

30
00:03:56.960 --> 00:04:00.909
FQ - Jake Hickey: I don't think so. I think it makes sense to me, just kind of go off and run with it.

31
00:04:01.320 --> 00:04:06.539
FQ Kristin Johnson: Okay, fantastic. So let me share my screen, let me make sure I've got the right thing up here.

32
00:04:06.820 --> 00:04:09.350
FQ Alex Kearns: Chris said this already, but,

33
00:04:09.510 --> 00:04:19.309
FQ Alex Kearns: This is incredibly helpful for us, and one thing that makes it even more impactful is if you can just be sort of, like, thinking out loud, where you're kind of

34
00:04:19.899 --> 00:04:22.109
FQ Alex Kearns: What you're doing is super useful.

35
00:04:22.480 --> 00:04:23.140
FQ - Jake Hickey: Okay.

36
00:04:23.610 --> 00:04:30.589
FQ Kristin Johnson: Alright, so, let me do this, then… Remote control…

37
00:04:31.630 --> 00:04:35.560
FQ Kristin Johnson: Alright, Jake, you should now have control of my screen.

38
00:04:35.660 --> 00:04:36.510
FQ Kristin Johnson: Perfect.

39
00:04:36.510 --> 00:04:37.010
FQ - Jake Hickey: Alright.

40
00:04:37.010 --> 00:04:52.919
FQ Kristin Johnson: I don't know what else you can see on my screen. I don't know if you see, like, the little Zoom… the little Zoom chat window, but feel free to, like, clear anything up that is in your way. The other thing, just as a heads up for you, the… just because of the way the screens are rendering on my… on my laptop.

41
00:04:52.930 --> 00:05:01.350
FQ Kristin Johnson: there's some controls that may be down in the footer, so you might have to scroll the page a little bit to, like, figure out the next thing to do in a normal environment.

42
00:05:01.350 --> 00:05:01.800
FQ - Jake Hickey: Okay.

43
00:05:01.800 --> 00:05:03.739
FQ Kristin Johnson: We would fit it within the screen.

44
00:05:04.130 --> 00:05:08.270
FQ - Jake Hickey: Gotcha. Okay. Okay, yeah, no, I don't see anything in my way right now, so I think I should be good to go.

45
00:05:08.550 --> 00:05:24.249
FQ Kristin Johnson: So, your job today is you're coming in, you have a data set you want to connect, and you've heard through the grapevine that, like, oh, there's this new data studio, it's self-serve, you know, data connection, so go for it.

46
00:05:24.360 --> 00:05:27.660
FQ Kristin Johnson: You're gonna set up your data, your data set.

47
00:05:27.660 --> 00:05:32.509
FQ - Jake Hickey: Sounds good. I feel pretty confident here. I'm sure that's gonna change, but I'll go ahead and select Add a Connector.

48
00:05:32.890 --> 00:05:39.309
FQ Kristin Johnson: And your… Natasha, thoughts on… on how to… to structure this to get him to the right place?

49
00:05:41.210 --> 00:05:50.619
FQ - Natasha Clark: Well, like… like Kristen said, it is… it is set up on a very, specific track.

50
00:05:50.740 --> 00:06:00.490
FQ - Natasha Clark: So, I mean, I think I'll just go ahead and tell you we want to… get through,

51
00:06:00.660 --> 00:06:06.710
FQ - Natasha Clark: a NetSuite connection, specifically. But I… I would love to see how you… how you get there.

52
00:06:07.350 --> 00:06:07.760
FQ - Jake Hickey: Okay.

53
00:06:07.760 --> 00:06:25.480
FQ - Natasha Clark: So that's what we want to see, and we, while you're going through this connector, while you're going through this first part, like, getting to the rest of that form, and you're looking at these options, like this first option that's presented here, like, like Chris said, I would love to hear you talk through,

54
00:06:25.480 --> 00:06:28.170
FQ - Natasha Clark: Your decision-making as you look at these questions.

55
00:06:28.630 --> 00:06:43.390
FQ - Jake Hickey: Okay, and I guess one question for you all is that… I know you said this is kind of like, almost like a PowerPoint, we're going slide by slide. Is it going to click through if I just click somewhere, like, anywhere, or do I need to click on the actual area to move on to the next page or next step?

56
00:06:43.990 --> 00:06:46.850
FQ - Natasha Clark: You do have to click on it as if you're in the form.

57
00:06:47.170 --> 00:06:53.179
FQ - Jake Hickey: Okay, just want to make sure, like, I'm not clicking something, and I'm getting rewarded when I shouldn't be clicking there, so… sounds good.

58
00:06:54.540 --> 00:07:06.310
FQ - Jake Hickey: Alright, perfect. So I know I clicked, you know, start this process here, so it looks like I'm on the connection type page. Choose the option that best fits your needs to get started, pre-built or custom.

59
00:07:06.630 --> 00:07:18.860
FQ - Jake Hickey: pre-built Flowcast support integrations, like QuickBooks Online, NetSuite, Sage Intac versus the Custom, which I'm assuming is more like the TBU clients that we have, so… since we're sticking with NetSuite, I'll go and select pre-built.

60
00:07:20.850 --> 00:07:25.149
FQ - Jake Hickey: And I guess as I'm talking through my thoughts, feel free to stop me at any point, too.

61
00:07:25.810 --> 00:07:37.179
FQ - Jake Hickey: Alright, select a connection type, choose the option that best fits your needs, pre-built or custom, okay, so now below, I'm seeing the different options we have here for pre-built. I'll go and select NetSuite.

62
00:07:38.930 --> 00:07:55.790
FQ - Jake Hickey: How do you want to connect NetSuite? Basic, syncs GL accounts and balances to support core reconciliation, enhanced, pulls GL accounts, transactions, and standard dimensions to power. I would… I don't know if there's a specific one here, I would like to see the enhanced process, so I would click on that.

63
00:07:56.830 --> 00:07:59.940
FQ Kristin Johnson: And really quickly, why? Why would you want to see it?

64
00:08:00.670 --> 00:08:18.150
FQ - Jake Hickey: Because it's enhanced, it's better than the basic, and knowing a little bit about what I know about Flowcast, and, like, Flow Lake, and being able to see, like, transaction-level details, as well as some other important dimensions that are flowing through with that enhanced connection, that just… you get more out of it, so that's the direction I would lean towards.

65
00:08:18.290 --> 00:08:23.330
FQ Kristin Johnson: Now, taking the customer mindset, how do you think the customer would be thinking about this?

66
00:08:24.170 --> 00:08:32.000
FQ - Jake Hickey: ultimately gonna depend on the customer and their needs. I think they would be probably a little…

67
00:08:32.400 --> 00:08:49.400
FQ - Jake Hickey: not confused, but unaware of which one might tie into their contract specifically, so I know, like, with some of these other features, like transactions, that's gonna be helpful for variants and AI matching and all that, versus if they did just have, like, core closed, basic would be all they needed.

68
00:08:49.400 --> 00:09:04.280
FQ - Jake Hickey: But at that point, I still don't think it would hurt to have enhanced, because there's always room for them to grow and adopt these other modules and features, so might as well already have the connection set up and ready to go by the time we look to get those. So, I guess a question I would have is.

69
00:09:05.000 --> 00:09:10.529
FQ - Jake Hickey: for you guys, but would BASIC ever be the better approach? Why wouldn't it always just be enhanced?

70
00:09:12.180 --> 00:09:15.100
FQ - Jake Hickey: Am I allowed to ask that question, or is this my chair?

71
00:09:15.330 --> 00:09:17.200
Rebecca Beasley-Cockroft (Sr. Product Manager): So am I allowed to… am I allowed to…

72
00:09:17.200 --> 00:09:20.319
FQ - Natasha Clark: Yeah, absolutely. You, you, you have the answers.

73
00:09:22.730 --> 00:09:25.549
Rebecca Beasley-Cockroft (Sr. Product Manager): Yeah, I mean, I think that,

74
00:09:25.870 --> 00:09:38.199
Rebecca Beasley-Cockroft (Sr. Product Manager): you know, if, you know, customers haven't bought a matching or variance, or they don't have Suite Analytics Connect, then they would go with Basic in this scenario.

75
00:09:38.310 --> 00:09:43.480
Rebecca Beasley-Cockroft (Sr. Product Manager): So I think it kind of depends on… You know, I think we'd…

76
00:09:44.550 --> 00:09:49.330
Rebecca Beasley-Cockroft (Sr. Product Manager): We'd love to be able to hook into, like, hey, these are the products that you bought, that's not quite ready yet.

77
00:09:49.330 --> 00:09:50.070
FQ - Jake Hickey: Yep.

78
00:09:50.070 --> 00:09:53.750
Rebecca Beasley-Cockroft (Sr. Product Manager): So, from a starting point, having both options available.

79
00:09:53.920 --> 00:09:56.300
Rebecca Beasley-Cockroft (Sr. Product Manager): Is where we've started.

80
00:09:56.940 --> 00:10:01.890
FQ Kristin Johnson: Gotcha. Jacob, something about that, you know, it's contract-dependent. Is there…

81
00:10:01.890 --> 00:10:25.239
FQ Kristin Johnson: is there something here, like, even here, because again, let's imagine a world where there's been that initial sales engagement, maybe even before they've talked to you, maybe they've talked to an onboarding manager or something, and there's just been this basic conversation about, yeah, you can go get set up anytime. Like, what would that customer be looking for? What should we reference them to? Is there additional assistance we could help them here without them having to do another reach out?

82
00:10:25.410 --> 00:10:31.319
FQ Kristin Johnson: To help them find whatever information they would need to know, is it basic or enhanced?

83
00:10:32.250 --> 00:10:39.500
FQ - Jake Hickey: Yeah, maybe just, like, a direct reference to, like, what Enhanced helps with specifically, like, I don't know, adding, like, a little caveat saying.

84
00:10:39.650 --> 00:10:45.189
FQ - Jake Hickey: helps with variance analysis, AI matching, transform, etc.

85
00:10:45.190 --> 00:11:10.160
FQ - Jake Hickey: within the enhanced tile, or, like, an asterisk that refers to it somewhere else, something along those lines. And, to kind of piggyback off that, too, I wasn't thinking about the Suite Analytics Connect part at first, and I totally skipped over that little blurb between here, so probably helpful, maybe, to make that jump out a little bit more for anybody, because if they don't have Suite Analytics Connect, and they click on this, I'm sure they probably can't get far, but if it's just, you know.

86
00:11:10.160 --> 00:11:11.570
FQ - Jake Hickey: More in your face about it.

87
00:11:12.320 --> 00:11:24.220
FQ Kristin Johnson: So you're saying part of it, and so I heard what you said about the suite analytics, but for part of it, too, maybe just indicating which modules they purchase would help clue them into probably which one they want.

88
00:11:24.220 --> 00:11:42.000
FQ - Jake Hickey: And not necessarily what modules they purchased, but just a blurb here about what modules this specifically helps for. So, if they see that the enhanced pertains to variance analysis and matching, and they know that that's not included. Obviously, it'd be more helpful if we can pull their direct contract in, I just imagine that's probably a little bit tougher to do.

89
00:11:42.030 --> 00:11:58.180
FQ - Jake Hickey: So just, yeah, again, like, a blurb about what modules it particularly helps for, and that might, at the end of the day, if they don't know, that just gets them talking about the contract, and if they don't have it, then potential upsell there. So, yeah, just something along the lines of having the modules listed out.

90
00:12:00.750 --> 00:12:01.570
FQ - Jake Hickey: All right.

91
00:12:02.530 --> 00:12:07.160
FQ - Jake Hickey: So I think I already clicked Enhanced, so I'll go ahead and select continue.

92
00:12:09.850 --> 00:12:18.849
FQ - Jake Hickey: Alright, so now we're on Connect to NetSuite, enter your connection authentication details, so display name for connection, assuming this is just…

93
00:12:19.080 --> 00:12:25.610
FQ - Jake Hickey: a name to reference in Flowcast afterwards, once all set up on the Connector tab.

94
00:12:25.810 --> 00:12:36.350
FQ - Jake Hickey: as a client, if I'm not too familiar with this, I'd be a little confused, so for your reference only. Alright, perfect. I think that's all you would need, so I'd go ahead and type that in.

95
00:12:36.650 --> 00:12:38.570
FQ - Jake Hickey: I don't know if clicking here's gonna do anything.

96
00:12:38.570 --> 00:12:41.679
FQ Kristin Johnson: Yeah, you don't need to click in anything. And again, this is super limited, so…

97
00:12:41.680 --> 00:12:50.680
FQ - Jake Hickey: Yeah, okay. Netsuite Enhanced Data Token, obviously that would be through the connection guide. Now, are they receiving a guide?

98
00:12:51.010 --> 00:12:57.090
FQ - Jake Hickey: Beforehand, to help with this, a secure key that lets external tools access your NetSuite data without your password.

99
00:12:57.460 --> 00:13:08.069
FQ - Jake Hickey: Because if I'm a customer, even just like myself now, and I'm clicking into this for the first time, without ever, like, referencing a guide, I'd probably… probably be a little confused about token and token secrets.

100
00:13:08.830 --> 00:13:10.460
FQ Kristin Johnson: And why is that?

101
00:13:11.100 --> 00:13:17.120
FQ - Jake Hickey: In case I'm not the NetSuite admin, I don't really know what tokens are in NetSuite.

102
00:13:17.250 --> 00:13:21.560
FQ - Jake Hickey: I haven't gone through that process. I probably wouldn't know where to go next.

103
00:13:21.760 --> 00:13:29.310
FQ Kristin Johnson: Do we… so, with… because you discovered the little on hovers, what should we do here, again, to give them more direction?

104
00:13:30.270 --> 00:13:32.019
FQ - Jake Hickey: A link to the setup guide.

105
00:13:32.450 --> 00:13:34.000
FQ - Jake Hickey: Would probably be helpful.

106
00:13:34.220 --> 00:13:34.910
FQ Kristin Johnson: Okay.

107
00:13:37.440 --> 00:13:41.000
FQ - Jake Hickey: And I guess maybe, like, a blurb just saying, like, for help getting the…

108
00:13:41.100 --> 00:13:51.150
FQ - Jake Hickey: token and token secret. Here's a link to our NetSuite setup guide that walks you the process of getting those. That's very longly worded, but some version of that.

109
00:13:51.150 --> 00:13:52.709
FQ Kristin Johnson: Okay, no, super helpful.

110
00:13:53.870 --> 00:13:56.520
FQ - Jake Hickey: Alright, sync frequency…

111
00:13:57.050 --> 00:14:07.320
FQ - Jake Hickey: that pretty straightforward, however often I'm seeking it, and even that extra context there helps with that, say, flowcast syncs data every hour, so I think that makes sense there.

112
00:14:07.800 --> 00:14:17.740
FQ - Jake Hickey: Connection status, pause, active, paused connections, retrieve available tables, but do not bring data into the system. Active connections bring data into the system.

113
00:14:18.970 --> 00:14:30.830
FQ - Jake Hickey: I guess I'm a little confused. Pause connections, retrieve available tables, but do not bring data in. So is that… is pause just pulling in what's in NetSuite right now, and then active as, like, a continuous connection between it?

114
00:14:35.650 --> 00:14:47.840
FQ Kristin Johnson: So, and Rebecca, you may need to jump in here, too. The expectation, because… and I'm gonna… I'm gonna tell you, because you already kind of exposed your question, the expectation is that…

115
00:14:48.030 --> 00:14:53.459
FQ Kristin Johnson: Paused would allow them to complete the connection and at least connect to…

116
00:14:53.650 --> 00:15:02.570
FQ Kristin Johnson: the basic table set, so they can confirm it as part of their setup before actually streaming the data into Flowcast.

117
00:15:02.720 --> 00:15:06.949
FQ Kristin Johnson: That's the distinction between the two, and Rebecca, am I correct in that?

118
00:15:08.800 --> 00:15:14.659
Rebecca Beasley-Cockroft (Sr. Product Manager): So, paused would be that we're not actively pulling in data.

119
00:15:14.780 --> 00:15:25.460
Rebecca Beasley-Cockroft (Sr. Product Manager): So… it has to do with the backend status of the actual connection. Active would be we're going and actually retrieving the data.

120
00:15:26.160 --> 00:15:32.040
FQ Kristin Johnson: But part of the setup, right, Rebecca, we are, even though it's in a pause, stage…

121
00:15:33.180 --> 00:15:36.230
FQ Kristin Johnson: We are starting to bring in table data, or no?

122
00:15:37.640 --> 00:15:43.500
Rebecca Beasley-Cockroft (Sr. Product Manager): That depends on how we implement it. It's… I was like, that's not relevant to the…

123
00:15:43.500 --> 00:15:49.979
FQ Kristin Johnson: So, but, I mean, but it is in terms of, one, setting customer expectation, and two, right, part of this flow does…

124
00:15:50.120 --> 00:15:57.619
FQ Kristin Johnson: does indicate, like, it sets an expectation of what's gonna happen, so I don't know that we need to hash through that now, but,

125
00:15:58.030 --> 00:16:10.970
FQ Kristin Johnson: Jake, what's your perspective on… on this? And this… this kind of goes back to the Fivetran connection, right? What… what… how we need to set customer expectations, because it may be that they want to be able to see those tables and choose the tables.

126
00:16:11.070 --> 00:16:15.689
FQ Kristin Johnson: before actively having data within their Flowcast instance.

127
00:16:16.940 --> 00:16:23.319
FQ - Jake Hickey: Gotcha. I think even still hearing this, it's… I get it now, but I think this whole section here is…

128
00:16:23.430 --> 00:16:34.069
FQ - Jake Hickey: pretty confusing as a customer playing around with this. I would have no idea what the difference between these two are, and ultimately what either of the end points are, by choosing one or the other.

129
00:16:34.260 --> 00:16:35.530
FQ Kristin Johnson: Okay, perfect.

130
00:16:37.310 --> 00:16:40.849
FQ - Jake Hickey: Do I need to choose one, or am I going to stick with pause, too?

131
00:16:40.850 --> 00:16:46.479
FQ Kristin Johnson: You can stick with paused, and you're going to need to scroll on this page, because again, the buttons didn't quite make it with you.

132
00:16:46.940 --> 00:16:47.840
FQ - Jake Hickey: Perfect.

133
00:16:50.570 --> 00:16:59.799
FQ - Jake Hickey: Alright, retrieving data table, connection test successful. We were able to authenticate this connection. Focus will start the process of tables. Processing takes several hours.

134
00:17:00.110 --> 00:17:05.949
FQ - Jake Hickey: We will email you, once all the tables are available, a link to this connection. Alright, continue.

135
00:17:08.099 --> 00:17:11.329
FQ Kristin Johnson: Before you continue, what is this telling you?

136
00:17:12.680 --> 00:17:20.409
FQ - Jake Hickey: I think quick, high-level connection was successful, so I would assume that my connection with Flowcast and NetSuite is good to go at this point.

137
00:17:20.700 --> 00:17:21.990
FQ Kristin Johnson: Okay.

138
00:17:22.660 --> 00:17:43.140
FQ - Jake Hickey: And, you know, what I understand about Focast as a new customer, I'm sure they talked about the NetSuite connection during the sales cycle and all that. I should believe now that I'll be able to pull in account balances, and depending on which option I took, transaction level detail, I would assume moving forward that that's all going to be available for me after selecting continue.

139
00:17:43.750 --> 00:17:53.739
FQ Kristin Johnson: Okay. And is there… is there data that you would or would not want in Flowcast based on a certain, you know, a certain connection?

140
00:17:56.500 --> 00:18:13.190
FQ - Jake Hickey: For me personally, no, but I think that's more of a Flowcast consultant, and just thinking that the most data we can get into Flowcast from NetSuite, the better for these clients, just because I've seen situations where we're not pulling stuff in, and they often don't like that. But I guess I…

141
00:18:13.710 --> 00:18:18.289
FQ - Jake Hickey: Would it be shocked if some clients don't want to pull in every single piece of data?

142
00:18:18.430 --> 00:18:29.050
FQ - Jake Hickey: But yeah, at least the GL, transactional detail, all that, that was listed out in some of those, that first page, I would expect all that to be available after this.

143
00:18:30.370 --> 00:18:34.139
FQ Kristin Johnson: So before Jake steps on, does anyone else have follow-ups?

144
00:18:40.400 --> 00:18:42.650
FQ Kristin Johnson: Okay, go ahead and hit continue.

145
00:18:43.000 --> 00:18:43.780
FQ - Jake Hickey: Right?

146
00:18:47.860 --> 00:19:00.760
FQ - Jake Hickey: Alright, review now. So, review and confirm connection, connect. Connection name, customer data, sales force, connection status, paused, which we selected, credentials valid.

147
00:19:02.770 --> 00:19:18.600
FQ - Jake Hickey: This section here, I'm assuming just has to do with that first page that I would have filled out with, like, the name that I input, credentials would have been those tokens and everything like that. Is that correct? I think it's just a little confusing now because I didn't actually type anything in, but I would see what I typed in.

148
00:19:18.760 --> 00:19:20.580
FQ Kristin Johnson: Yes, that is the reputation.

149
00:19:20.800 --> 00:19:26.269
FQ - Jake Hickey: Okay, and I could edit it in case I want to change the name or change the status from pause to active.

150
00:19:27.230 --> 00:19:28.090
FQ Kristin Johnson: Correct.

151
00:19:28.640 --> 00:19:37.270
FQ - Jake Hickey: Alright, let's see, select tables, load status, in process, notification emails, edit is grayed out.

152
00:19:39.410 --> 00:19:48.429
FQ - Jake Hickey: I would say I'm a little confused about this, if there's an action item here, just because I'm not able to edit this right now.

153
00:19:48.660 --> 00:19:55.160
FQ - Jake Hickey: And I guess, again, kind of going back to what we just talked about with the pause and active and the different tables that we'd be pulling in.

154
00:19:55.370 --> 00:20:01.389
FQ - Jake Hickey: Again, I think I might be a little confused of what tables I'm looking at, or trying to work with here.

155
00:20:02.030 --> 00:20:07.130
FQ Kristin Johnson: Okay, and when you say you're confused as to what tables, you mean for this specific connector, the next one?

156
00:20:07.130 --> 00:20:07.750
FQ - Jake Hickey: Correct.

157
00:20:07.750 --> 00:20:11.789
FQ Kristin Johnson: It's just not clear at all which tables we will be retrieving.

158
00:20:12.180 --> 00:20:23.299
FQ - Jake Hickey: Yeah, and again, I'm sure it might be different if a client's more of a NetSuite admin versus not, but I could see this being confusing to any of the folks on the accounting team that aren't necessarily, like.

159
00:20:23.630 --> 00:20:25.959
FQ - Jake Hickey: NetSuite admins or IT folks.

160
00:20:25.960 --> 00:20:27.580
FQ Kristin Johnson: Okay.

161
00:20:28.060 --> 00:20:33.050
FQ Kristin Johnson: And you mentioned, you mentioned, yes, the edit table, or the edit button's grayed out.

162
00:20:33.290 --> 00:20:35.750
FQ Kristin Johnson: So that was a little confusing.

163
00:20:39.980 --> 00:20:41.900
FQ Kristin Johnson: Like, why is that confusing?

164
00:20:42.820 --> 00:20:59.839
FQ - Jake Hickey: Well, it's saying select tables here, load test and process. I'm just not sure what this is asking me to do. If there is an action item at all, it's having me review, this is the review page, so if there wasn't an option to review anything, I'm not really seeing anything to review in general.

165
00:21:00.140 --> 00:21:15.310
FQ Kristin Johnson: Okay, and so what if, what if something in there for the select tables essentially said, you know, we're in the process of bringing your tables in, you know, we will notify you when they're ready, at that point you can come back to see which data, blah blah blah.

166
00:21:16.040 --> 00:21:17.460
FQ - Jake Hickey: I think that'd be more helpful.

167
00:21:17.460 --> 00:21:19.270
FQ Kristin Johnson: Okay, and can you go back?

168
00:21:19.800 --> 00:21:23.869
FQ Kristin Johnson: And that little footer… oh, it may not be wired up, actually. I take that back.

169
00:21:24.020 --> 00:21:30.200
FQ Kristin Johnson: If you can click back in your back… oh, yeah, I don't think it's gonna go anywhere, though. Can you click back in your browser?

170
00:21:31.360 --> 00:21:32.260
FQ - Jake Hickey: share.

171
00:21:36.890 --> 00:21:40.490
FQ Kristin Johnson: So this was actually the select tables Tap.

172
00:21:40.770 --> 00:21:42.740
FQ Kristin Johnson: Which is what you're recalling.

173
00:21:43.100 --> 00:21:54.699
FQ Kristin Johnson: Yeah, so what I'm wondering is, is a better… is a better way to handle this to not gray out the page, but in the area where we would be loading the table data, like, have that message literally

174
00:21:54.850 --> 00:21:58.850
FQ Kristin Johnson: In the body of the page, where eventually the table data will appear.

175
00:21:59.880 --> 00:22:00.640
FQ Kristin Johnson: Because this did…

176
00:22:00.640 --> 00:22:01.230
FQ - Jake Hickey: But…

177
00:22:01.230 --> 00:22:04.260
FQ Kristin Johnson: Yep, and if you see above in the little wizard, we've got.

178
00:22:04.260 --> 00:22:06.600
FQ - Jake Hickey: Okay, so, like, tables, yeah.

179
00:22:06.600 --> 00:22:10.110
FQ Kristin Johnson: Would that have made it more clear in terms of working through a process?

180
00:22:10.740 --> 00:22:14.960
FQ - Jake Hickey: Probably, so would there be steps taken here, as I'm selecting continue?

181
00:22:14.960 --> 00:22:16.140
FQ Kristin Johnson: Well, and again, several.

182
00:22:16.140 --> 00:22:17.230
FQ - Jake Hickey: It would still be the same thing.

183
00:22:17.230 --> 00:22:20.540
FQ Kristin Johnson: But until… until we actually…

184
00:22:20.820 --> 00:22:27.540
FQ Kristin Johnson: You know, whether we're actively loading tables, whether we're just doing that call to get, like, the list of tables, like, whatever it is, right?

185
00:22:28.070 --> 00:22:31.920
FQ Kristin Johnson: There will be a period in which, like, we don't have anything.

186
00:22:32.830 --> 00:22:33.650
FQ - Jake Hickey: Gotcha.

187
00:22:33.650 --> 00:22:34.660
FQ Kristin Johnson: Go for it, Rebecca.

188
00:22:35.960 --> 00:22:39.099
Rebecca Beasley-Cockroft (Sr. Product Manager): Jake, if… as you're setting this up.

189
00:22:40.860 --> 00:22:44.290
Rebecca Beasley-Cockroft (Sr. Product Manager): Do you know what data you're looking for?

190
00:22:46.020 --> 00:22:49.220
FQ - Jake Hickey: I would assume GL data.

191
00:22:50.000 --> 00:22:52.930
FQ - Jake Hickey: Account balances, transaction detail.

192
00:22:54.300 --> 00:22:57.520
FQ - Jake Hickey: department dimensions… I guess…

193
00:22:58.080 --> 00:23:05.190
FQ - Jake Hickey: Yeah, the dimensions, and then also, like, the balances at the broken-out level as well, but yeah, pretty much just, like, all data that would roll up into, like, the GL.

194
00:23:06.140 --> 00:23:06.930
Rebecca Beasley-Cockroft (Sr. Product Manager): Okay.

195
00:23:07.220 --> 00:23:15.769
Rebecca Beasley-Cockroft (Sr. Product Manager): And… Do you feel like you know what that looks like from in the ERP's structure?

196
00:23:16.910 --> 00:23:18.920
FQ - Jake Hickey: Probably not.

197
00:23:21.390 --> 00:23:24.129
Rebecca Beasley-Cockroft (Sr. Product Manager): Okay, and then one more question. Do you…

198
00:23:24.590 --> 00:23:32.150
Rebecca Beasley-Cockroft (Sr. Product Manager): When you're doing this setup, do you want to do the custom… any customization up front?

199
00:23:32.490 --> 00:23:38.969
Rebecca Beasley-Cockroft (Sr. Product Manager): Or… Do you want to see the data first, and then say, oh, I need to make modifications?

200
00:23:39.740 --> 00:23:43.360
FQ - Jake Hickey: I think I would like to see the data first, and then make modifications.

201
00:23:44.380 --> 00:23:44.910
Rebecca Beasley-Cockroft (Sr. Product Manager): Okay.

202
00:23:45.470 --> 00:23:47.159
Rebecca Beasley-Cockroft (Sr. Product Manager): Okay, that's all really helpful.

203
00:23:50.300 --> 00:23:52.820
FQ Kristin Johnson: You can hit that continue button again, Jake.

204
00:23:52.820 --> 00:23:53.470
FQ - Jake Hickey: Okay.

205
00:23:55.230 --> 00:23:56.800
FQ Kristin Johnson: Alright, now what would you do?

206
00:23:57.950 --> 00:24:08.489
FQ - Jake Hickey: So, everything that we talked about with tables, I would assume that, you know, everything's good here, tables are all set, and I'm seeing two options to save only, save and set active.

207
00:24:08.990 --> 00:24:15.300
FQ - Jake Hickey: assuming that that ties back to that status that we were talking about beforehand, I…

208
00:24:15.600 --> 00:24:31.579
FQ - Jake Hickey: be a little bit confused of what save only does versus save and set active. Again, I think just because of what we talked about beforehand. Now I think I would know a little bit that active is going to actually establish the connection, and data will be flowing into Flowcast versus Save Only, it's still in that paused status.

209
00:24:32.170 --> 00:24:35.199
FQ Kristin Johnson: Okay, so maybe they should be save as paused.

210
00:24:35.870 --> 00:24:40.340
FQ - Jake Hickey: Yeah, I think that would maybe be helpful, save in parentheses, pause, or, you know, something like that.

211
00:24:40.510 --> 00:24:41.370
FQ Kristin Johnson: Okay.

212
00:24:42.470 --> 00:24:45.710
FQ - Jake Hickey: In this case, I'll select save and set active.

213
00:24:45.880 --> 00:24:48.390
FQ Kristin Johnson: Sure, that's, yeah, that's the only one that's gonna get you anywhere.

214
00:24:48.570 --> 00:24:49.300
FQ - Jake Hickey: Okay.

215
00:24:49.650 --> 00:24:50.530
FQ - Jake Hickey: Perfect.

216
00:24:51.090 --> 00:24:56.470
FQ - Jake Hickey: So, in the Data Studio tab now, under the Connectors tab.

217
00:24:58.210 --> 00:25:00.999
FQ - Jake Hickey: Connector name, it's the table in general.

218
00:25:01.980 --> 00:25:11.939
FQ - Jake Hickey: Is the connector name what we just established, so we could technically add multiple Data Studio connections here that are listed out? Looks like it, because we have customer data, then a 01.

219
00:25:13.460 --> 00:25:15.040
FQ - Jake Hickey: QVO as well.

220
00:25:15.950 --> 00:25:19.419
FQ - Jake Hickey: We can see the status of each one, which is straightforward.

221
00:25:20.190 --> 00:25:26.759
FQ - Jake Hickey: active versus connected, both being green, I think I'd be curious what the difference is there.

222
00:25:28.190 --> 00:25:29.570
FQ - Jake Hickey: Oh, okay. Entities…

223
00:25:29.930 --> 00:25:42.270
FQ - Jake Hickey: Entities make sense. I guess connected… no, because pause is there. Yeah, so I guess I don't know the difference between connected and active. Entities make sense, and I can add an entity if needed. I'm sure that's a hyperlink, I'll pop something open.

224
00:25:42.270 --> 00:25:52.739
FQ - Jake Hickey: And then last synced is just gonna tell me the last time we pulled in the data, and I'm assuming it's gonna be based off of the syncing cadence that we set up as we were building the connection.

225
00:25:53.350 --> 00:26:00.229
FQ Kristin Johnson: Okay. So in this… so in this case, and let's… so row 1, let's assume that row 1 actually says paused.

226
00:26:00.530 --> 00:26:00.920
FQ - Jake Hickey: to the back.

227
00:26:01.730 --> 00:26:11.450
FQ Kristin Johnson: And let's say that you got an email, and the email said, hey, Jake, your NetSuite Enhanced data, has finished loading into Data Studio.

228
00:26:11.450 --> 00:26:12.060
FQ - Jake Hickey: Gotcha.

229
00:26:12.060 --> 00:26:14.829
FQ Kristin Johnson: And so, you do want to see it, what would you do?

230
00:26:15.950 --> 00:26:26.389
FQ - Jake Hickey: I would probably click either on this arrow here, as soon as I would drop it down or open it up in some fashion, and if that didn't work, I'd click into the ellipses.

231
00:26:26.860 --> 00:26:29.630
FQ - Jake Hickey: So, I'll just play around, I'll click this.

232
00:26:30.990 --> 00:26:33.479
FQ - Jake Hickey: Looks like that pulled in most of the data.

233
00:26:33.780 --> 00:26:38.730
FQ - Jake Hickey: and this is the Select Tables tab again, so that's…

234
00:26:38.910 --> 00:26:42.319
FQ - Jake Hickey: becoming a little bit more full circle there, so we have our GL lines…

235
00:26:42.750 --> 00:26:56.840
FQ - Jake Hickey: different data fields, the type of it, so yeah, all helpful information around what this data actually is. Looks like I can look at transaction detail, and then accounts. So I'm assuming this is just gonna be, like, trial balance accounts, which is helpful.

236
00:27:00.140 --> 00:27:03.290
FQ Kristin Johnson: Is there any data on this page that is missing?

237
00:27:04.700 --> 00:27:09.299
FQ - Jake Hickey: Geo lines and the information there.

238
00:27:13.090 --> 00:27:13.980
FQ - Jake Hickey: I don't…

239
00:27:14.450 --> 00:27:27.609
FQ - Jake Hickey: think so. Not that I would be aware of, at least. I mean, you know, clicking through the transactions and accounts might be helpful in terms of stuff is missing there, but I imagine it wouldn't be. This is just all the transactions and accounts that are in NetSuite, so… no, I don't think so.

240
00:27:27.870 --> 00:27:33.300
FQ Kristin Johnson: Would you actually, or do you think a customer would want to be able to see the actual data, or samples of the actual data?

241
00:27:35.220 --> 00:27:38.319
FQ - Jake Hickey: I would have thought that that would be under transactions and accounts.

242
00:27:39.750 --> 00:27:41.090
FQ Kristin Johnson: Can you say that again?

243
00:27:41.330 --> 00:27:51.340
FQ - Jake Hickey: I thought, like, samples of the data, like samples of the transaction detail, or samples of the accounts and the data there. I would need to click into the transactions or the accounts tab to do so.

244
00:27:51.720 --> 00:27:54.779
FQ Kristin Johnson: Okay, and why would they want to see samples?

245
00:27:55.440 --> 00:28:01.600
FQ - Jake Hickey: Just to make sure it works and confirm if they're looking at this page, and then NetSuite pulled open, just to do a cross-check.

246
00:28:02.690 --> 00:28:03.300
FQ Kristin Johnson: What would they.

247
00:28:03.300 --> 00:28:20.129
FQ - Jake Hickey: See how it looks in Flowcast. Most likely, I would assume balance is the number one thing to check between. But then, yeah, I guess making sure, like, the balance is tied to each transaction, depending on what they're looking at across, like, departments.

248
00:28:20.360 --> 00:28:23.849
FQ - Jake Hickey: other dimensions. But yeah, balance, I think, would be the number one thing.

249
00:28:26.810 --> 00:28:28.749
FQ Kristin Johnson: Anyone else that follows for Jake?

250
00:28:34.450 --> 00:28:44.449
FQ Alex Kearns: I guess just in terms of, like, information on the screen, and, like, kind of how you felt in terms of, like, the amount of information you've had, and, like.

251
00:28:45.740 --> 00:29:01.189
FQ Alex Kearns: kind of that line of, like, oh, I feel a little overwhelmed, like there's too much, or okay, I feel confident that you're doing what you're saying you're doing. Just kind of curious, as you've gone through the screens, what your experience has been there, and where that line is.

252
00:29:02.820 --> 00:29:11.580
FQ - Jake Hickey: I think, as someone who'd be more on the accounting side and not necessarily the IT side, this page isn't telling me a whole lot.

253
00:29:11.710 --> 00:29:28.340
FQ - Jake Hickey: that I'd be able to confirm. I think if I was opening up this page, I'd be clicking into transactions or accounts first, so it could be more helpful to see accounts as, like, the first one, then transactions, then GL line, so they can click through it in a more organized fashion for an accountant to review their work.

254
00:29:28.850 --> 00:29:30.790
FQ - Jake Hickey: Or review the connection, I should say.

255
00:29:30.950 --> 00:29:32.990
FQ Alex Kearns: Okay, that's really interesting.

256
00:29:36.010 --> 00:29:53.890
FQ - Jake Hickey: But at the same time, if I was an IT admin, and I was clicking here, I'm sure this would be helpful, just to understand the data and how it's pulling in. But either way, if it's… if they're able to click into it on the left-hand side, and I assume, more often than not, we'd be seeing accountants doing this, or that's the idea, I think accountants would be…

257
00:29:53.890 --> 00:29:56.100
FQ - Jake Hickey: A better landing page for this.

258
00:29:58.210 --> 00:29:59.180
FQ Alex Kearns: Great.

259
00:30:00.200 --> 00:30:04.769
FQ Kristin Johnson: Okay, we can go ahead and go next, and we've got one minute here, Jake, so hopefully we won't keep.

260
00:30:04.770 --> 00:30:19.830
FQ - Jake Hickey: Oh, okay. Alright, sounds good. This is just the same page again, which I was assuming it would be. Selected tables, the lines, transactions, accounts, everything that we saw beforehand, and the ability to edit it if needed, but I think everything would be good to go here, so then I would go ahead and select Save Updates.

261
00:30:22.410 --> 00:30:23.160
FQ Kristin Johnson: Okay.

262
00:30:24.730 --> 00:30:29.340
FQ Kristin Johnson: any, any final thoughts, observations, recommendations?

263
00:30:30.060 --> 00:30:39.459
FQ - Jake Hickey: Just curious what the ellipses would do here. If I can click on it, is it gonna do anything for me? Take me back. Is that expected behavior, or would there be different options?

264
00:30:39.900 --> 00:30:42.469
FQ Kristin Johnson: natasha, do you know?

265
00:30:45.280 --> 00:30:52.010
FQ - Natasha Clark: Oh, the ellipses would be to perform…

266
00:30:52.340 --> 00:30:56.430
FQ - Natasha Clark: Like, just specific actions that wouldn't necessarily be…

267
00:30:57.010 --> 00:31:00.349
FQ - Natasha Clark: Available, like, in the… in the…

268
00:31:00.600 --> 00:31:13.180
FQ - Natasha Clark: in the row of the table, so something like a… like a quick click type of action, right? Like, so it could be something, like, if you wanted to, from the table, pause a connection, like, manually. Gotcha.

269
00:31:13.550 --> 00:31:22.789
FQ - Natasha Clark: doing, being able to do something like that, like essentially changing the status, without having to go into the details of the connector. That's what the.

270
00:31:22.790 --> 00:31:23.370
FQ - Jake Hickey: What about…

271
00:31:23.370 --> 00:31:23.740
FQ - Natasha Clark: That's what that.

272
00:31:23.740 --> 00:31:26.539
FQ - Jake Hickey: Like, a manual resync, would that be available?

273
00:31:27.420 --> 00:31:40.290
FQ - Natasha Clark: That's a good question. There is a world where that could be the case. I'm hesitant to give, like, a static yes or no to that, because…

274
00:31:40.440 --> 00:31:55.339
FQ - Natasha Clark: things around refreshing or, like, manual refresh and things like that, I think, are still heavily under discussion. Correct me if I'm wrong, Rebecca. But yeah, there's a world where if that option existed, that's probably where it would live.

275
00:31:55.860 --> 00:32:08.570
FQ - Jake Hickey: Gotcha. Yeah, I mean, I just think I'm curious more about, like, other functionality here that we didn't get to see today, but I think overall what we walked through today was pretty straightforward in terms of what I was able to understand and get through. Obviously I had

276
00:32:08.700 --> 00:32:17.769
FQ - Jake Hickey: talked through most of the areas that were a little bit more confusing than others. But overall, pretty easy to follow along with, and I…

277
00:32:17.860 --> 00:32:34.529
FQ - Jake Hickey: just, I think, you know, having an understanding of the guide and what I need to do on NetSuite, and then coming back into Flowcast and do would probably be the one thing that I would iterate the most on. At least it's importance, because, again, it's not like we can just do it all through Flowcast. There are still steps needed within NetSuite, so having just a reference to that would be helpful.

278
00:32:38.120 --> 00:32:38.890
FQ Kristin Johnson: Okay.

279
00:32:39.460 --> 00:32:48.910
FQ Kristin Johnson: I am running late to another meeting, so Jake, I totally appreciate your time. This is… it's just incredibly helpful, right, for us to dial the design in, so thanks for being our guinea pig.

280
00:32:49.180 --> 00:32:54.139
FQ - Jake Hickey: Of course. Yeah, thank you for including me. Thank you so much. I'm happy to help here as well, so if there's anything else that I can do, please let me know.

281
00:32:54.490 --> 00:32:55.920
FQ Kristin Johnson: Definitely, thanks so much.

282
00:32:56.150 --> 00:32:57.740
FQ - Jake Hickey: Alright, thanks everyone. Bye.

