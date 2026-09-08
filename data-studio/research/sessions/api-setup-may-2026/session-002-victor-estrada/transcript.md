# Transcript — Session 002

**Date:** 2026-05-08
**Study:** Connector Setup — API Connection Flow
**Participant:** Victor Estrada (FloQast ATC II)
**Facilitators:** Kristin Johnson, Natasha Clark

---

WEBVTT

1
00:00:09.480 --> 00:00:10.760
FQ Kristin Johnson: Hey, Victor.

2
00:00:11.930 --> 00:00:13.510
FQ Victor Estrada: Hi, Kristen, how are you?

3
00:00:14.190 --> 00:00:23.720
FQ Kristin Johnson: Good! We had… Lilith yesterday, please forward on to her how grateful we are for everything she endured.

4
00:00:23.720 --> 00:00:25.730
FQ Victor Estrada: I see, I see.

5
00:00:25.730 --> 00:00:44.669
FQ Kristin Johnson: And so there will be other folks joining us, but we're short on time, so I'm just gonna go ahead and start my patter right away. So, first for you, we're recording this session mainly so we can, like, extract insights out of the conversation for recommendations if we need to change. So are you good with being recorded?

6
00:00:46.250 --> 00:00:48.279
FQ Kristin Johnson: Oh, we lost your audio, Victor.

7
00:00:49.090 --> 00:00:50.370
FQ Kristin Johnson: I think you're muted.

8
00:00:50.730 --> 00:00:51.810
FQ Victor Estrada: Can you hear me now?

9
00:00:52.020 --> 00:00:55.930
FQ Victor Estrada: Perfect, that sounds good. Sorry, I coughed and I paused my audio.

10
00:00:55.930 --> 00:01:05.220
FQ Kristin Johnson: Perfect, okay. And then also, the purpose, like, what we're doing here today is,

11
00:01:05.220 --> 00:01:22.099
FQ Kristin Johnson: Natasha and I are the two designers on Data Studio. We've come up with some designs, and we're trying to break the design, right? We're trying to find out where the design is going to fail, and so you're helping us be that person that's testing the design to see where the failure points are.

12
00:01:22.100 --> 00:01:29.079
FQ Kristin Johnson: our end goal for Data Studio, maybe it's ambitious, but ideally, at the end of the day, like, the folks that you're talking to on the phone

13
00:01:29.450 --> 00:01:48.689
FQ Kristin Johnson: helping them get stuff set up. With documentation, ideally, they could walk themselves through the entire process and be mostly successful. That's our goal, right? So, anything that's gonna happen, with what we're gonna have you do today is, like, that is our gap for what we need to do to get those customers successful.

14
00:01:48.720 --> 00:01:53.469
FQ Kristin Johnson: So we're gonna have you walk through a prototype of a design that we've come up with.

15
00:01:53.730 --> 00:02:00.960
FQ Kristin Johnson: And by prototype, you know, it's smoke and mirrors, right? It's, like, pasted together pages, there's no underlying real functionality.

16
00:02:01.680 --> 00:02:04.359
FQ Kristin Johnson: You know, in terms of feeding back to a database or anything.

17
00:02:04.740 --> 00:02:09.370
FQ Kristin Johnson: But it's, you know, it'll look and feel like, like an interface.

18
00:02:09.530 --> 00:02:13.580
FQ Kristin Johnson: Our request to you, again, because you're helping us test this, like.

19
00:02:14.230 --> 00:02:24.970
FQ Kristin Johnson: you're… you yourself are not being tested, you're helping us test the prototype, so we're gonna let you fail, because that's the intent, right? Because we wanna… we wanna have you fail before a customer fails.

20
00:02:24.970 --> 00:02:39.449
FQ Kristin Johnson: Things that are super helpful for us are when you're, like, when you're confused, if you're frustrated, if you're like, this is just bad, guys. This is just bad design. Like, be candid. This is, like, the whole point of having these conversations is because, like, we want your candid feedback.

21
00:02:39.500 --> 00:02:53.300
FQ Kristin Johnson: The other thing that's super helpful is as you walk through these screens, that think aloud process as you're, like, trying to figure out what stuff is, if you can articulate as best you can as you're having those moments.

22
00:02:53.320 --> 00:02:59.699
FQ Kristin Johnson: That's super helpful for us, because that, again, helps us start aligning to what, you know, the same common questions customers may have.

23
00:02:59.960 --> 00:03:05.460
FQ Kristin Johnson: I think just the other thing, too, is,

24
00:03:06.460 --> 00:03:09.309
FQ Kristin Johnson: Gosh, lost my… lost my track of… train of thought here.

25
00:03:09.310 --> 00:03:28.660
FQ Kristin Johnson: Yeah, I mean, oh, so sorry. So the one other thing is we… we are going to let you struggle, and so I apologize for that, because that's hard, but again, we're not… we're not judging you, we're not testing you, we're wanting to see the failure points in the design, and we'd rather subject you to that failure than subject an end customer to that failure. So again, you're just pressure testing this for us.

26
00:03:29.530 --> 00:03:30.180
FQ Victor Estrada: Okay.

27
00:03:30.180 --> 00:03:40.949
FQ Kristin Johnson: Okay, so anything… any questions for us? And also on the call are Alex and Rebecca. They were the brains behind what we're doing here. So they're… you have a large audience, and I apologize for, like.

28
00:03:41.980 --> 00:03:46.080
FQ Kristin Johnson: But it's super helpful for us to see this real time, right?

29
00:03:46.660 --> 00:03:57.159
FQ Victor Estrada: No, no questions. I will do my best to get through it, and if I have any frustrations, I'll voice it, and I'll make sure I kind of pinpoint where I'm struggling so that you guys have that on your end.

30
00:03:57.410 --> 00:04:15.739
FQ Kristin Johnson: Beautiful. Okay, so I am going to… hopefully… let me do this really quickly… I'm going to drop you a link in the chat. Okay. And if you can open that link and share your screen, and then I'm also going to drop you a document. And the intent… the intent is that you will use that document to kind of walk through.

31
00:04:16.560 --> 00:04:21.709
FQ Kristin Johnson: What we're having you go through. And we do have a hard stop at…

32
00:04:21.990 --> 00:04:24.620
FQ Kristin Johnson: Noon, because we are gonna then…

33
00:04:26.670 --> 00:04:28.600
FQ Kristin Johnson: have Kira go through the same thing.

34
00:04:28.950 --> 00:04:29.380
FQ Victor Estrada: Okay.

35
00:04:30.490 --> 00:04:35.710
FQ Kristin Johnson: Guys, is there… how do I get a document into the chat? Am I missing something?

36
00:04:35.710 --> 00:04:37.489
FQ Victor Estrada: I'm gonna share my screen.

37
00:04:38.400 --> 00:04:42.949
FQ Kristin Johnson: Here, Victor, I'm just gonna Slack it to you, because I'm, for some reason, I'm not able to see how to…

38
00:04:43.560 --> 00:04:45.999
FQ Kristin Johnson: How to attach a document in the chat, I thought we could.

39
00:04:47.480 --> 00:04:49.390
Rebecca Beasley-Cockroft (Sr. Product Manager): No, you have to just put the link in.

40
00:04:49.630 --> 00:04:51.710
Rebecca Beasley-Cockroft (Sr. Product Manager): No attaching, unfortunately.

41
00:04:51.710 --> 00:04:56.429
FQ Kristin Johnson: Oh, okay, yeah, in this case, I'm gonna give him the downloaded version, so that'll be… it'll be easier.

42
00:04:56.860 --> 00:04:58.999
FQ Kristin Johnson: Then he doesn't have to download it.

43
00:04:59.530 --> 00:05:00.569
FQ Victor Estrada: Appreciate that.

44
00:05:00.760 --> 00:05:01.290
FQ Kristin Johnson: Yep.

45
00:05:01.290 --> 00:05:03.409
FQ Victor Estrada: It means to struggle less a little bit at the beginning.

46
00:05:03.410 --> 00:05:14.129
FQ Kristin Johnson: And again, like, I so apologize to you if, you know, if things are hard. Before you dive in, I just have a few quick questions for you.

47
00:05:15.250 --> 00:05:26.589
FQ Kristin Johnson: 1. So, on a scale of 1 to 5, 5 being not at all, or excuse me, 1 being not at all and 5 being extremely, how knowledgeable do you feel you are about technical things like ABIs?

48
00:05:27.140 --> 00:05:31.400
FQ Victor Estrada: I've never built one out, but I think I can work my way around, like, answering

49
00:05:32.230 --> 00:05:35.969
FQ Victor Estrada: Some questions, so maybe, like, a 1.52, like, a one and a half.

50
00:05:36.520 --> 00:05:37.440
FQ Victor Estrada: to 2.

51
00:05:37.440 --> 00:05:46.859
FQ Kristin Johnson: Okay, perfect. And for the process we're about to have you walk through, how technically challenging do you anticipate that it's going to be?

52
00:05:47.170 --> 00:05:59.780
FQ Victor Estrada: I think, like, building an API, it's my first time actually building one, so I feel like it's gonna be difficult. And I'm assuming, like, if you were to present this to an accountant on the client side, they would anticipate the same thing.

53
00:06:00.190 --> 00:06:02.019
FQ Kristin Johnson: Okay, so you're gonna put it at, like, a 4, a 5?

54
00:06:02.020 --> 00:06:04.560
FQ Victor Estrada: I would say 4, 4 or 5, like, around there.

55
00:06:04.560 --> 00:06:13.570
FQ Kristin Johnson: Okay, and then, how much effort do you think you're going to have to put into this process of completing this connection?

56
00:06:13.770 --> 00:06:16.769
FQ Victor Estrada: I would also say kind of like a 4 or 5.

57
00:06:16.940 --> 00:06:23.930
FQ Victor Estrada: Around there, just because, like, if I don't understand something, having to go research it, having to go troubleshoot, kind of things like that.

58
00:06:24.110 --> 00:06:37.019
FQ Kristin Johnson: Okay, perfect. Alright, so, if you can share your screen, lovely. We're gonna just let you go. That documentation you have is something that our average customer might get, so… go for it.

59
00:06:37.510 --> 00:06:38.320
FQ Victor Estrada: Alright.

60
00:06:41.730 --> 00:06:46.789
FQ Kristin Johnson: And again, so even, even right there, that last step,

61
00:06:47.130 --> 00:06:51.330
FQ Kristin Johnson: If you can help us understand, like, why… why you make one choice versus.

62
00:06:51.330 --> 00:07:01.950
FQ Victor Estrada: I see. So, like, right here, pre-built, like, if I am a customer and I know that the data that I need isn't coming from QuickBooks, NetSuite, or Intact, then I would request them.

63
00:07:02.030 --> 00:07:23.900
FQ Victor Estrada: From here, I would say, like, okay, I can upload a file, that's easy, I can do an SFTP, but let's say a customer wants, like, I want to build out an API just to kind of pull these things, so I don't have to have an SFTP kind of pulling the file, getting it sent over, I just want that automatic connection between, like, one system to another, then I would choose API here.

64
00:07:24.110 --> 00:07:30.010
FQ Kristin Johnson: Okay, and you're doing a fantastic job of the… the showing what's in your mind. Love it, thank you so much.

65
00:07:30.010 --> 00:07:30.870
FQ Victor Estrada: Of course, appreciate it.

66
00:07:30.870 --> 00:07:38.450
FQ Kristin Johnson: And again, so, sorry, back up one more step, really quickly. Again, you made a choice there, if you could just articulate a little bit about your choices.

67
00:07:38.450 --> 00:07:58.390
FQ Victor Estrada: Yeah, so, custom or pre-built, I think custom, I would go custom. Edit, like, if I do API, like, I know API, I can pull directly from this thing, so I would go, like, hit that, and then from here, I'm like, okay, I have, like, I want it to be custom, and I want it to be an API, so then I would assume, just go continue here.

68
00:07:59.010 --> 00:08:00.620
FQ Kristin Johnson: Okay, thank you. Helpful.

69
00:08:00.620 --> 00:08:03.490
FQ Victor Estrada: And then from here, okay, connector name…

70
00:08:03.910 --> 00:08:06.540
FQ Victor Estrada: Let's just say, like, test. Like…

71
00:08:06.830 --> 00:08:12.020
FQ Victor Estrada: if I was doing, like, a, like, Coupa information… CUPA balances.

72
00:08:12.350 --> 00:08:23.059
FQ Victor Estrada: I would assume I would just name the connector with whatever I need it to be, like, what system I'm connecting to, and then what am I pulling in from there. Api URL…

73
00:08:23.370 --> 00:08:25.520
FQ Victor Estrada: I'm assuming it's gonna be this here.

74
00:08:29.050 --> 00:08:34.740
FQ Victor Estrada: Health check you ping URL. A URL forecast being taken from the API is reachable before syncing.

75
00:08:35.090 --> 00:08:38.810
FQ Victor Estrada: the root address of the API. Look for the base URL or host.

76
00:08:39.130 --> 00:08:39.780
FQ Victor Estrada: So…

77
00:08:39.789 --> 00:08:43.799
FQ Kristin Johnson: When you did a copy-paste, where were you… where were you getting your copy-paste from?

78
00:08:43.799 --> 00:08:48.149
FQ Victor Estrada: From the connection details page, this piece here.

79
00:08:49.640 --> 00:08:49.990
FQ Kristin Johnson: Like that.

80
00:08:50.380 --> 00:08:52.830
FQ Victor Estrada: I'll do this, maybe it'll be easier to kind of.

81
00:08:52.830 --> 00:08:56.339
FQ Kristin Johnson: Yeah, it looked like your copy-paste didn't carry over to that field, that's why.

82
00:08:56.340 --> 00:08:57.040
FQ Victor Estrada: Oh.

83
00:08:58.100 --> 00:08:59.310
FQ Victor Estrada: I wonder why.

84
00:09:00.540 --> 00:09:02.769
FQ Kristin Johnson: And that's a downloaded doc, hopefully you're able to

85
00:09:03.280 --> 00:09:08.890
FQ Kristin Johnson: Lovely, okay. I had some issues with Lilith yesterday. This is perfect, thank you for the split screen.

86
00:09:08.890 --> 00:09:15.610
FQ Victor Estrada: Yeah, so then, API base, the root address of the API, look for base URL or host in your docs.

87
00:09:16.460 --> 00:09:22.750
FQ Victor Estrada: So, base URL, so base URL, okay, health check or ping URL, a URL flick has pings.

88
00:09:22.750 --> 00:09:26.189
FQ Kristin Johnson: I can actually skip that, because I didn't update the documentation to handle that, so…

89
00:09:26.190 --> 00:09:43.120
FQ Victor Estrada: Okay, yeah, I was gonna start trying to look for it. Okay, environment, I mean, typically they do want to, like, clients either choose between sandbox or production. When you say, like, sandbox, is this sandbox Flowcast Sandbox, or…

90
00:09:43.550 --> 00:09:46.340
FQ Victor Estrada: The… the sandbox from, like, a…

91
00:09:46.780 --> 00:09:50.389
FQ Victor Estrada: the system that we're pulling from. I'm assuming Flowcast Sandbox.

92
00:09:50.770 --> 00:09:54.400
FQ Kristin Johnson: Rebecca, clarify, I'm pretty sure it's full of cashiers.

93
00:09:54.400 --> 00:09:56.439
Rebecca Beasley-Cockroft (Sr. Product Manager): No, it should be the other system.

94
00:09:56.670 --> 00:10:02.059
FQ Victor Estrada: Gotcha. Okay, so then, yeah, I would… like, I think maybe it would be easier, let's just say, like…

95
00:10:02.470 --> 00:10:11.870
FQ Victor Estrada: I guess in… I guess you're connecting to API, so, like, you can make that assumption, but I could also see clients maybe saying, like, which one, because some clients do…

96
00:10:12.040 --> 00:10:21.449
FQ Victor Estrada: set up a sandbox flowcast and a production flowcast. Like, I have a client that has both, and right now they're sending it to the sandbox environment, so I could easily see that being, like, a…

97
00:10:21.800 --> 00:10:22.910
FQ Victor Estrada: a thing.

98
00:10:23.120 --> 00:10:25.410
FQ Victor Estrada: Let's say Sandbox.

99
00:10:25.660 --> 00:10:30.380
FQ Victor Estrada: API version. Required by some APIs, check your docs.

100
00:10:30.600 --> 00:10:33.820
FQ Victor Estrada: API version. We have an API version.

101
00:10:34.450 --> 00:10:39.440
FQ Victor Estrada: I don't see a version here, so I would assume I would just skip since it's not required.

102
00:10:40.000 --> 00:10:49.149
FQ Victor Estrada: Authentication API key, so I'll leave as API key there, and then my API key, it's gonna be this right here.

103
00:10:52.550 --> 00:10:54.270
FQ Victor Estrada: Why does it do that?

104
00:10:57.780 --> 00:10:59.669
FQ Victor Estrada: There it is. Okay.

105
00:10:59.940 --> 00:11:07.659
FQ Victor Estrada: And I think it copied everything. Send API key via where your API key should be placed in the request your docs.

106
00:11:07.920 --> 00:11:11.990
FQ Victor Estrada: header… Header, and then header name.

107
00:11:12.860 --> 00:11:14.999
FQ Victor Estrada: Because it's an authentication.

108
00:11:15.590 --> 00:11:16.470
FQ Victor Estrada: header.

109
00:11:16.870 --> 00:11:32.109
FQ Victor Estrada: Okay, let's hopefully… there it is. Okay, so… is this pretty much typical, what… what gets provided, like, what comes from a client system? Because then I feel like it would be easy, like, it does seem kind of easy, because I'm just following along.

110
00:11:32.850 --> 00:11:34.439
FQ Kristin Johnson: Rebecca, can you speak to that?

111
00:11:36.080 --> 00:11:43.069
Rebecca Beasley-Cockroft (Sr. Product Manager): Yeah, so… you can have… Usually this stuff is, like, in somebody's head or buried in API.

112
00:11:43.070 --> 00:11:44.580
FQ Victor Estrada: Yeah, but…

113
00:11:44.580 --> 00:11:48.649
Rebecca Beasley-Cockroft (Sr. Product Manager): So, like, there's definitely a component about how would you get this document.

114
00:11:48.650 --> 00:11:49.440
FQ Victor Estrada: Yes.

115
00:11:49.440 --> 00:11:57.459
Rebecca Beasley-Cockroft (Sr. Product Manager): But yeah, there are, like, there are standard pieces of information about an API that you need to be able to run an API.

116
00:11:57.650 --> 00:12:07.439
FQ Victor Estrada: Gotcha. Okay, yeah, I think as, like, this was very easy to follow along, in my opinion. I feel like if a client has something like this, then they could follow along with kind of these.

117
00:12:08.610 --> 00:12:16.309
FQ Victor Estrada: These blurbs, which are very helpful, especially this one, if it doesn't have, like, a version, then maybe we can just go. Let's test connection.

118
00:12:16.730 --> 00:12:17.900
FQ Victor Estrada: Amazing.

119
00:12:18.980 --> 00:12:29.710
FQ Victor Estrada: Okay, define your endpoints at each API endpoint you want to sync, you'll configure request details, parameters, and schedule in the next step. Okay, endpoint name. So, let's get general ledger entries.

120
00:12:31.930 --> 00:12:33.120
FQ Victor Estrada: entries.

121
00:12:33.550 --> 00:12:38.289
FQ Victor Estrada: Endpoint path, so I'm assuming this is the path, this is what we want to get.

122
00:12:39.470 --> 00:12:43.780
FQ Victor Estrada: And then frequencies… That's Steve.

123
00:12:43.890 --> 00:12:49.520
FQ Victor Estrada: When you say free, change frequency, What does that mean?

124
00:12:50.720 --> 00:12:51.749
FQ Kristin Johnson: What do you think it means?

125
00:12:52.090 --> 00:12:55.930
FQ Victor Estrada: I feel like, how often is, like.

126
00:12:56.350 --> 00:13:00.249
FQ Victor Estrada: Change frequency. Journal of entries, like, how often are we…

127
00:13:00.390 --> 00:13:06.829
FQ Victor Estrada: Updating this based on, like, the information that is getting, like, that we're supposed to be getting.

128
00:13:07.120 --> 00:13:07.810
FQ Victor Estrada: Okay.

129
00:13:07.950 --> 00:13:09.219
FQ Victor Estrada: It's either that.

130
00:13:09.790 --> 00:13:10.500
FQ Kristin Johnson: Go ahead.

131
00:13:10.500 --> 00:13:16.840
FQ Victor Estrada: I was gonna say, it's either that, or how often can this possibly change? Like, how often is the end path changing?

132
00:13:17.040 --> 00:13:18.979
FQ Victor Estrada: So I feel like it'd be one of those two.

133
00:13:19.280 --> 00:13:25.160
FQ Kristin Johnson: It's my understanding, and again, Rebecca, you can correct me on this, it's my understanding of how often the underlying data is changing.

134
00:13:25.160 --> 00:13:26.000
FQ Victor Estrada: Okay.

135
00:13:26.160 --> 00:13:29.230
FQ Kristin Johnson: So, but again, helpful observation for thank you for that.

136
00:13:29.740 --> 00:13:35.490
FQ Victor Estrada: Yeah, so then I would be like, okay, it's frequent if we're doing general ledger entries, if they're doing, like.

137
00:13:35.670 --> 00:13:38.810
FQ Victor Estrada: Or, yeah, I would do frequent.

138
00:13:39.170 --> 00:13:43.509
FQ Victor Estrada: it looks like we're doing another endpoint here for AP invoices.

139
00:13:44.940 --> 00:13:48.519
FQ Victor Estrada: And then we want this endpoint for invoices here.

140
00:13:49.350 --> 00:13:54.310
FQ Victor Estrada: And let's just do this one frequently, let's do this one occasional, because I feel like that would be more…

141
00:13:54.640 --> 00:13:58.630
FQ Victor Estrada: Okay, so those are the endpoints Create Expense Report.

142
00:14:00.810 --> 00:14:01.840
FQ Victor Estrada: Okay.

143
00:14:02.280 --> 00:14:07.340
FQ Victor Estrada: And then, is this retrieve positioned the range for specified values?

144
00:14:09.990 --> 00:14:16.379
FQ Victor Estrada: Okay, I feel like this is not gonna be a GET anymore. This is a posting.

145
00:14:17.860 --> 00:14:30.169
FQ Victor Estrada: So, like, for this piece, like, are we doing, like, the get and, like, the put, like, all in one screen? Is that happening here? So, like, we're getting this information and then posting? Like, how is this…

146
00:14:30.550 --> 00:14:43.220
FQ Victor Estrada: Because I know, like, in the API, maybe I'm, like, thinking about it wrong with, like, the current API documentation that we have, like, where the customer has to get everything, and then they have, like, a put endpoint to, like, where it gets sent to. Is this all happening in this screen?

147
00:14:44.870 --> 00:14:47.160
FQ Kristin Johnson: Maybe.

148
00:14:47.160 --> 00:14:59.609
FQ Victor Estrada: Okay. Yeah, because if I want to do that, then, like, if it's all happening here, then I would say, like, expense report, and then this is kind of the path that we're posting to there.

149
00:15:01.470 --> 00:15:05.000
FQ Victor Estrada: And then, from here, let's just do, like, occasional.

150
00:15:06.120 --> 00:15:11.620
FQ Victor Estrada: And then update payment status, and then let's just do payment status here as well.

151
00:15:13.380 --> 00:15:16.260
FQ Victor Estrada: And then this would be the final one here.

152
00:15:19.130 --> 00:15:23.439
FQ Victor Estrada: And then, okay, and then let's just do occasional as well.

153
00:15:24.080 --> 00:15:27.909
FQ Victor Estrada: Notes, path furniture, URL, not perfect.

154
00:15:28.040 --> 00:15:37.109
FQ Victor Estrada: Send data… send data in the requested body as JSON. Okay, so it is sending the data. The API key above has expired. Okay.

155
00:15:37.630 --> 00:15:49.490
FQ Victor Estrada: So then I would assume, like, these are all of the things that I want to do in terms of, like, getting the information, and then where it's going to, so then I would assume I would be good to go.

156
00:15:51.020 --> 00:15:52.309
FQ Victor Estrada: a good day.

157
00:15:52.920 --> 00:15:56.399
FQ Victor Estrada: Sync… okay, so I would hit next at this point.

158
00:15:58.170 --> 00:15:59.079
FQ Kristin Johnson: Oh, you know, you're gonna have a.

159
00:15:59.080 --> 00:15:59.470
FQ Victor Estrada: a problem.

160
00:15:59.470 --> 00:16:05.220
FQ Kristin Johnson: I'm doing a screen share in this one, so you can probably… Expand. Yeah, yeah, perfect.

161
00:16:05.220 --> 00:16:06.010
FQ Victor Estrada: Okay.

162
00:16:06.010 --> 00:16:08.169
FQ Kristin Johnson: Although we've been enjoying the split screen, so…

163
00:16:08.170 --> 00:16:10.269
FQ Victor Estrada: Let me, let me move this here.

164
00:16:10.270 --> 00:16:10.830
FQ Kristin Johnson: Okay.

165
00:16:10.830 --> 00:16:18.580
FQ Victor Estrada: Okay, now here is where we're defining everything, I think? Okay, so let's start with… AP invoices…

166
00:16:18.870 --> 00:16:21.820
FQ Victor Estrada: Let's throw a general ledger so I can do it one by one. Okay.

167
00:16:22.180 --> 00:16:27.179
FQ Victor Estrada: So this is the endpoint, we're gonna get it. Okay, perfect, this is where it happens, okay.

168
00:16:27.180 --> 00:16:41.549
FQ Kristin Johnson: And something really quickly that I wanted to touch on there. So, Victor, you were asking about it at the step… the step before, right? So, we're gonna assume that most customers, like, have no idea what get, post, patch, any of that is.

169
00:16:41.620 --> 00:16:48.960
FQ Kristin Johnson: Given the likelihood of their lack of knowledge, do you think that makes more sense for them to enter it there?

170
00:16:48.960 --> 00:16:52.929
FQ Victor Estrada: I think so, I think it would be nice to have, like,

171
00:16:53.850 --> 00:17:01.530
FQ Victor Estrada: enter it here, and also have, like, a blurb, like, one of those blurbs that we saw in the past, just explaining, like, what I get, put.

172
00:17:01.720 --> 00:17:16.450
FQ Victor Estrada: and, get, post, and match, like, what it is, just so that they know, like, okay, cool, like, this is what the information I'm getting, and then this is the information that I'm gonna be, like, posting. So I think that that would be helpful, having it as, like, an extra.

173
00:17:16.450 --> 00:17:17.329
FQ Kristin Johnson: Thank you.

174
00:17:18.859 --> 00:17:19.969
FQ Victor Estrada: Okay.

175
00:17:20.529 --> 00:17:32.199
FQ Victor Estrada: So we're gonna get information here. How do we want to pull the data retrieve? Post a journal entries within date range for a specified ledger. So, we're gonna get data from…

176
00:17:33.679 --> 00:17:39.289
FQ Victor Estrada: Like, a description, so we're getting data for a specific date.

177
00:17:42.139 --> 00:17:47.239
FQ Victor Estrada: I'm trying to think here. This is where I think my knowledge stops.

178
00:17:47.979 --> 00:18:05.009
FQ Victor Estrada: Okay, so I'm assuming that if we're saying, like, a full refresh, we're getting, like, there's no filters. We're just getting full refresh of any general ledgers that are, general ledger entries that are getting, like, posted that we are kind of pulling in. So this is kind of, like, everything that we need.

179
00:18:05.269 --> 00:18:13.619
FQ Victor Estrada: cursor, I'm not… let me see… whether fully cast fetches only new records, uses a bookmark, or repulls everything each sync. Okay, so then…

180
00:18:14.069 --> 00:18:23.389
FQ Victor Estrada: New records, I'm assuming, would be… yeah, I would… I would… I would be wondering, like, which of the three here? So, like, if you're filtering by date.

181
00:18:24.609 --> 00:18:32.119
FQ Victor Estrada: Is that… can you filter it? Did the parameter name your API uses to filter by date? Look in the parameters table.

182
00:18:32.529 --> 00:18:36.569
FQ Victor Estrada: Okay, so it looks like we are having parameters here.

183
00:18:39.850 --> 00:18:47.009
FQ Kristin Johnson: In this case, I'm going to tell you the prototype's wrong, I think, because I think you do need a 2 from, maybe? And it's not there.

184
00:18:47.700 --> 00:18:49.019
FQ Victor Estrada: of this part, okay.

185
00:18:49.020 --> 00:18:54.129
FQ Kristin Johnson: Yeah, so there may be a bubble, a little bump there, so that's… that's from… that's fine.

186
00:18:54.130 --> 00:18:55.169
FQ Victor Estrada: Okay, we'll see.

187
00:18:55.170 --> 00:18:56.370
FQ Kristin Johnson: the prototype.

188
00:18:56.810 --> 00:19:04.220
FQ Victor Estrada: Gotcha, and then response, I'm assuming, would be JSON, since that's what I see, like, most people, like, get this information from?

189
00:19:04.530 --> 00:19:09.840
FQ Victor Estrada: So, like, that's what I would assume it would be, but I think, like.

190
00:19:10.430 --> 00:19:14.359
FQ Victor Estrada: Having that information. Also, like, what, like.

191
00:19:14.550 --> 00:19:23.120
FQ Victor Estrada: like, how, like, response format, like, what is typically common? Because, yeah, I'm assuming, like, a typical accountant won't know, like.

192
00:19:23.400 --> 00:19:26.779
FQ Victor Estrada: which one is it? Is it a JSON, XML, or CSV?

193
00:19:26.910 --> 00:19:31.579
FQ Victor Estrada: But I'm gonna go JSON, since that's what I usually see, like, when I deal with any APIs.

194
00:19:32.070 --> 00:19:36.579
FQ Kristin Johnson: Is there any of the documentation that would help you, or would help the accountant?

195
00:19:36.580 --> 00:19:37.720
FQ Victor Estrada: Let me see.

196
00:19:38.760 --> 00:19:47.170
FQ Victor Estrada: Retrieve post journal entries within a date range for specified ledger, date, end period, filter to specific ledger account. Let me scroll down.

197
00:19:48.370 --> 00:20:00.200
FQ Victor Estrada: Post parameters, show us parameter name as part of the URL, post and patch request, send data in the request body as JSON. Okay, not as URL, so it says JSON there. So, JSON.

198
00:20:00.200 --> 00:20:14.870
FQ Kristin Johnson: With that said, you kind of had to go back and look. What would you recommend for us to direct… like, with that question, let's assume that someone really had that question, thoughts for how to help them answer that question themselves?

199
00:20:15.090 --> 00:20:23.420
FQ Victor Estrada: I think it would be, like, what, like, what, how, like, what is a typical JSON format? Like, not in terms of, like.

200
00:20:23.820 --> 00:20:32.720
FQ Victor Estrada: when do you choose this, right? As opposed to an Excel or CSV? Like, if you're choosing Excel or CSV, is it, like, specific?

201
00:20:32.910 --> 00:20:45.059
FQ Victor Estrada: times you choose it, like, when do you actually choose it? Like, for, like I said, APIs, I've only seen JSONs, really, so I've never seen, like, CSV or Excel, at least from what I've been working on, so then it's like.

202
00:20:45.080 --> 00:20:53.150
FQ Victor Estrada: at least for my knowledge, like, when would I use… when would you choose, like, a CSV or a Excel for, like, an API, like, ingestion?

203
00:20:53.590 --> 00:21:08.209
FQ Victor Estrada: So I guess, like, specifying when versus, like, the typical JSON. If it's, like, I don't even know if that's, like, the typical thing all the time, but if that's the typical thing all the time, then just specifying when you would do it in Excel or CSV, as opposed to that.

204
00:21:08.380 --> 00:21:09.770
FQ Kristin Johnson: Sure. Okay.

205
00:21:11.130 --> 00:21:17.999
FQ Victor Estrada: Okay, and then… like, here, I would expect to be able to continue adding parameters, like…

206
00:21:18.170 --> 00:21:34.609
FQ Victor Estrada: For the date 2, like you said, and then, like, ledger… like, I see ledger ID is not required, so don't need that, but, like, date 2, I would assume, like, there would be something here, like, to say add parameter, or continue adding parameters, here.

207
00:21:35.010 --> 00:21:35.640
FQ Kristin Johnson: Okay.

208
00:21:35.640 --> 00:21:37.080
FQ Victor Estrada: But let's just go query.

209
00:21:38.460 --> 00:21:39.770
FQ Victor Estrada: perimeter name.

210
00:21:40.180 --> 00:21:44.800
FQ Victor Estrada: So then, let's just say, like, Date from again?

211
00:21:47.550 --> 00:21:50.340
FQ Kristin Johnson: Sorry, I'm getting cut off.

212
00:21:50.800 --> 00:21:52.010
FQ Victor Estrada: Aprim.

213
00:21:53.440 --> 00:21:58.360
FQ Victor Estrada: And then a value would be, like… looks like an example value.

214
00:21:58.920 --> 00:22:02.019
FQ Victor Estrada: I want the value to send for this parameter on every request.

215
00:22:02.500 --> 00:22:07.259
FQ Kristin Johnson: And how are you… how are you getting the information that you're putting in these fields?

216
00:22:07.260 --> 00:22:15.810
FQ Victor Estrada: like, the example values, but then, like, if I read this, it says, like, the value to send for this parameter on every request.

217
00:22:16.900 --> 00:22:27.729
FQ Victor Estrada: like, so is this a static value, or is this just an example value? Like, is this the example of, like, what we need to have, or is this, like, the value of every request?

218
00:22:28.340 --> 00:22:29.000
FQ Kristin Johnson: Okay.

219
00:22:30.290 --> 00:22:32.390
FQ Victor Estrada: And then, this would be a date type.

220
00:22:34.180 --> 00:22:40.729
FQ Victor Estrada: And then parameter name. Okay, I think this is, like, a… can we add a date to here?

221
00:22:43.150 --> 00:22:47.269
FQ Victor Estrada: And let's just say this is, like, M24-03-31?

222
00:22:47.980 --> 00:22:51.719
FQ Victor Estrada: Is your date type? Okay. And then I would say, like.

223
00:22:51.940 --> 00:22:53.769
FQ Kristin Johnson: Can you show your split screen again?

224
00:22:53.770 --> 00:22:54.430
FQ Victor Estrada: Yeah.

225
00:22:59.350 --> 00:23:02.750
FQ Kristin Johnson: And can you show me where you're pulling these values on your dock?

226
00:23:03.430 --> 00:23:08.789
FQ Victor Estrada: So, like, here for GL, I would be pulling it from, like.

227
00:23:09.080 --> 00:23:14.469
FQ Victor Estrada: This area, and this area, and then this, and this, and this is, like, required and required.

228
00:23:14.630 --> 00:23:16.080
FQ Kristin Johnson: Okay, perfect, thank you.

229
00:23:16.310 --> 00:23:16.850
FQ Victor Estrada: Yeah.

230
00:23:18.060 --> 00:23:21.110
FQ Victor Estrada: And I see that we do have, like, this at the very end.

231
00:23:21.800 --> 00:23:25.029
FQ Victor Estrada: So, full refresh, daily, start from today.

232
00:23:25.240 --> 00:23:27.130
FQ Victor Estrada: Max retries.

233
00:23:27.290 --> 00:23:35.159
FQ Victor Estrada: You're getting your filtering by date, okay, cool. Date, filter, parameter, date from, I'm assuming the next would be date 2, date format, okay.

234
00:23:35.820 --> 00:23:37.700
FQ Victor Estrada: I would assume this looks good now.

235
00:23:39.510 --> 00:23:42.960
FQ Victor Estrada: Because there's no other things that we need here.

236
00:23:43.160 --> 00:23:48.520
FQ Victor Estrada: So then I would go… let me get my other one here, I'm gonna move it down below.

237
00:23:51.480 --> 00:23:53.989
FQ Victor Estrada: So then I would assume I would just go Schedule.

238
00:23:54.690 --> 00:24:02.260
FQ Victor Estrada: And then, full refresh… like… Incremental adds only new or changed records for…

239
00:24:02.520 --> 00:24:19.310
FQ Victor Estrada: Okay, this is kind of nice to know. It's just incremental, I would do that. Sync frequency, let's say, daily, or every… let's do every 6 hours, and let's start from today, and then Max retries. How many times Flowcache retries a failed sync before reporting it out? Nice!

240
00:24:19.910 --> 00:24:21.270
FQ Victor Estrada: And then I would test it.

241
00:24:22.090 --> 00:24:23.520
FQ Victor Estrada: And I go from there.

242
00:24:24.860 --> 00:24:32.350
FQ Kristin Johnson: Okay, so there's, there's no finished step for you, so this is, this is, like, as far in the process as we can get. Okay.

243
00:24:33.580 --> 00:24:47.420
FQ Kristin Johnson: One… one bit of feedback in terms of the build itself. So you had four endpoints, right? What is your feeling about the level of effort of then building out those four endpoints?

244
00:24:48.900 --> 00:24:56.740
FQ Victor Estrada: I feel like based off this one, I mean, if I had all the information readily available, like, right now, I don't think it'd be too difficult. I feel like it'd be, like.

245
00:24:56.890 --> 00:25:06.359
FQ Victor Estrada: the 40 minute, like, 30 minutes to, like, an hour max to build out these, but I think, like, gathering everything would take a while.

246
00:25:06.360 --> 00:25:24.689
FQ Victor Estrada: I think one thing I would… I think would be nice to have is, like, the value type here, right? This, because, like, string integer versus boolean, right? Sometimes I feel like people won't know exactly, like, which one, right? Date's pretty easy, but, like, a string integer, like, a boolean, like, yes, no, like.

247
00:25:25.130 --> 00:25:28.780
FQ Victor Estrada: those might not be… I feel like it would be nice to have, like, a…

248
00:25:28.950 --> 00:25:40.550
FQ Victor Estrada: like, another little thing here explaining each. Okay. Then that would be helpful, and then I think, like, this having, like, example value would be nice, because I think that's how it would work, because I see this here being, like.

249
00:25:40.790 --> 00:25:50.489
FQ Victor Estrada: a different date, like, within here. Or, like, is this truly, like, the value range that's gonna run every time? That's, like, a question that I would have.

250
00:25:50.890 --> 00:25:59.199
FQ Kristin Johnson: Okay. And then, so, now that you've been through the process, how technically challenging do you… do you think it actually was?

251
00:25:59.650 --> 00:26:15.259
FQ Victor Estrada: I would say probably a two. It's not that challenging. I think, like, once we have… once I, like… if I need to get definitions, then I think yes. But I think, given how you guys laid everything out in the document, I think it made it easy to follow along.

252
00:26:15.260 --> 00:26:25.579
FQ Victor Estrada: But I also think, like, if I was coming into this blind without knowing, like, get, put, or anything like that, then it would be a little bit more challenging, but I would say maybe, like, a 2.

253
00:26:25.620 --> 00:26:27.349
FQ Victor Estrada: From my viewpoint.

254
00:26:27.580 --> 00:26:44.699
FQ Kristin Johnson: Okay. So we have a few minutes left, so I'm gonna let, Natasha and Alex and Rebecca follow up, and then guys, I'll probably drop just a little before noon and start with Kira, and I can give her, like, all the upfront, and then if you guys want to run a little along with Victor, you can.

255
00:26:45.240 --> 00:26:50.620
FQ Kristin Johnson: and come in. Although, I think, Natasha, we were going to focus on the connection setup piece, so you might want to drop early, too.

256
00:26:51.760 --> 00:26:52.720
FQ Kristin Johnson: Okay.

257
00:26:53.710 --> 00:26:58.470
FQ Kristin Johnson: Also, I'll stick around until, like, you know, For a couple more minutes.

258
00:26:58.960 --> 00:27:17.069
FQ - Natasha Clark: Well, Victor, you already kind of answered one of my questions, which was, like, did you feel like anything was missing? And I feel like you did a good job of, along the way, saying what you thought was missing, or what you would like to see. So then I guess my other question would be, did you find anything

259
00:27:17.420 --> 00:27:22.120
FQ - Natasha Clark: particularly frustrating? Or that, like, just made you feel like…

260
00:27:22.770 --> 00:27:25.300
FQ - Natasha Clark: Really don't know what to do next.

261
00:27:25.300 --> 00:27:31.859
FQ Victor Estrada: I think the one piece would be, like, as I'm going through, like, Like, connect, so, like…

262
00:27:31.980 --> 00:27:45.730
FQ Victor Estrada: that first piece of knowing, like, hey, like, do I need to, like, add, put, match, or anything like that in this step, or is it the next one? I can see that being a little bit frustrating. Also, maybe some of, like, the definitions.

263
00:27:45.810 --> 00:27:54.309
FQ Victor Estrada: could be a little bit frustrating, and I think, like, just being, like, not knowing exactly where, or, like.

264
00:27:54.450 --> 00:27:59.460
FQ Victor Estrada: Here, I'll share my screen again. Like, knowing exactly…

265
00:28:00.930 --> 00:28:13.129
FQ Victor Estrada: once it loads, like, these little areas, right? Like, I think endpoint name, endpoint path, pretty straightforward, but, like, change frequency, what does that mean exactly, right? And then also, like.

266
00:28:13.130 --> 00:28:24.450
FQ Victor Estrada: if I go to the next screen, like, the put, get post, like, if I'm on this screen, I would be like, okay, I'm defining these endpoints, but, like, what are they going to do? Like, is it at this step? I think…

267
00:28:24.450 --> 00:28:29.719
FQ Victor Estrada: manage endpoints, it makes sense, like, once you get into the other screen. But I think, like.

268
00:28:29.720 --> 00:28:45.069
FQ Victor Estrada: that's not a big, big one, because if I hit next, then I can see everything's here, so it's… that's not really a big one, on my end. But then I think, like, this piece, like, how to pull data, like, I'm not 100% sure, like, if I'm filtering by dates, right, versus, like.

269
00:28:45.070 --> 00:29:01.199
FQ Victor Estrada: cursor, what does that mean? And then, like, full refresh is a full refresh, right? So, like, that piece, right? So if I'm doing full refresh, and then I can query and add, like, parameters here, okay, I get that now. But here, I'm like, okay, I'm filtering by dates, like.

270
00:29:01.290 --> 00:29:04.480
FQ Victor Estrada: Date filter parameter, name, and then, like.

271
00:29:04.710 --> 00:29:14.639
FQ Victor Estrada: what is this piece, right? I think that would be just a little frustrating if I'm not 100% sure. So I think this piece would be a little bit frustrating.

272
00:29:15.850 --> 00:29:17.280
FQ Victor Estrada: Could be frustrating.

273
00:29:17.860 --> 00:29:23.819
FQ Victor Estrada: I think it's mostly, like, definitions, like, having more definitions, or kind of more guided pieces here.

274
00:29:26.300 --> 00:29:26.930
FQ - Natasha Clark: Okay.

275
00:29:27.290 --> 00:29:35.379
FQ - Natasha Clark: I am actually also gonna drop, because I have to, like, move to the basement for the next call, but, Alex and Rebecca, I don't know if you had any other questions?

276
00:29:37.660 --> 00:29:44.800
Rebecca Beasley-Cockroft (Sr. Product Manager): Yeah, I mean, I don't have any other questions at the moment, but just wanted to say thank you so much. Like, this is so helpful for us in terms.

277
00:29:44.800 --> 00:29:45.890
FQ - Natasha Clark: Yes, thank you.

278
00:29:45.890 --> 00:29:48.730
Rebecca Beasley-Cockroft (Sr. Product Manager): Like, I know it's a lot of people to watch you do something where you're like.

279
00:29:48.730 --> 00:29:49.390
FQ Victor Estrada: what I'm doing.

280
00:29:49.620 --> 00:29:54.269
Rebecca Beasley-Cockroft (Sr. Product Manager): But just wanted to… like, this is super helpful for us from a, like.

281
00:29:54.270 --> 00:30:09.799
Rebecca Beasley-Cockroft (Sr. Product Manager): One of the things we're worried about here is the complexity, and so getting early feedback of, like, hey, this makes sense, or, like, seeing you be able to be successful, or seeing where you fail in this process helps us think through how do we… how do we plan for the complexity. So, it's super helpful.

282
00:30:09.800 --> 00:30:10.679
FQ Victor Estrada: Of course, yeah.

283
00:30:10.680 --> 00:30:13.420
Rebecca Beasley-Cockroft (Sr. Product Manager): And I think you know more about APIs than you think you do, so…

284
00:30:13.420 --> 00:30:29.479
FQ Victor Estrada: I've worked with one client that's tested me, so I feel like I'm glad that I learned a little bit along the way. But this piece, like, just for my knowledge, can you do, like, an API and it could send, like, an XML CSV? Like, what are the use cases for that?

285
00:30:29.480 --> 00:30:34.540
Rebecca Beasley-Cockroft (Sr. Product Manager): Older APIs will, like, give you back data in some of those formats.

286
00:30:34.830 --> 00:30:35.610
FQ Victor Estrada: Damn.

287
00:30:35.610 --> 00:30:39.849
Rebecca Beasley-Cockroft (Sr. Product Manager): You… I… as you were saying that, I was like, oh, he's just been spoiled with newer technology.

288
00:30:39.850 --> 00:30:46.140
FQ Victor Estrada: Yeah, I've only seen hands on, I have not seen anything else, so I was like, I wonder what this is for.

289
00:30:46.530 --> 00:30:50.999
FQ Alex Kearns: Yeah. Yeah, I've seen those other formats,

290
00:30:52.180 --> 00:30:58.200
FQ Alex Kearns: An API is really just another way of transmitting data.

291
00:30:58.890 --> 00:31:13.790
FQ Alex Kearns: So that's part of the reason why you can do that. And, like, sometimes you'll go to the URL that's an API, and what'll get returned is, like, you'll see something with CSVs and stuff like that, with, like, essentially that is a CSV.

292
00:31:14.190 --> 00:31:22.570
FQ Victor Estrada: Gotcha, but, like, when we ingest it, it's same exact, like, there's no change in terms of, like, these three formats, like, the way that we see it when it comes into Flowcast.

293
00:31:22.740 --> 00:31:42.020
FQ Alex Kearns: So what's important for us about those formats, and I think this step is not, like, clear on here, but knowing what the format is helps us to understand how to interpret that data and, like, store it on our side, right? So, like, I think about this idea that, like.

294
00:31:42.110 --> 00:31:57.979
FQ Alex Kearns: when data comes in, it comes into, like, almost like a big funnel, right? Of, like, we have all these different formats we're gonna support and everything coming in, but then you sort of need to start unifying, like, what that format looks like. So, like, in my opinion, there probably would need to be another step

295
00:31:57.980 --> 00:32:07.959
FQ Alex Kearns: Where you're sort of defining, hey, what is the format of what you're gonna pass back to us? So not just, like, what format is it in, but then we would need to translate that almost into, like, a format…

296
00:32:08.310 --> 00:32:21.290
FQ Alex Kearns: at least of my mental model, for, like, into, like, almost like a table-like format. So then you can take that data and say, okay, well, what field maps to the Flowcast balances field?

297
00:32:21.290 --> 00:32:22.340
FQ Victor Estrada: Mmm,

298
00:32:22.340 --> 00:32:43.129
FQ Alex Kearns: And also, like, the structure of both XML and JSON is kind of interesting, because it's so, like, hierarchical in nature, unlike a CSV, right? Like, I think about a CSV as, like, you're almost, like, living in a unique row. It doesn't necessarily need to be as aware of other things around it, versus you can have sort of, like, that nesting, where you could have, like.

299
00:32:43.210 --> 00:32:46.230
FQ Alex Kearns: An account. That's, like, the parent.

300
00:32:46.540 --> 00:32:54.929
FQ Alex Kearns: object, and then within there, you might have, like, balances, and then you might have something else inside of it, if that makes sense? So, kind of need to do that translation.

301
00:32:55.170 --> 00:33:02.549
FQ Victor Estrada: Gotcha, okay, okay. Yeah, I think that would help as well. Yeah, like you said, because, like, if I'm just looking from here, I'm like, okay, like, I…

302
00:33:02.810 --> 00:33:07.210
FQ Victor Estrada: Assumed that, okay, we're just receiving this, and then it's automatically gonna get

303
00:33:07.540 --> 00:33:12.659
FQ Victor Estrada: done. Like, there's no other step, but it makes sense that we would receive it, and then we'd have to map it out.

304
00:33:13.250 --> 00:33:17.209
FQ Alex Kearns: Okay. Yeah. I did have one other question for you. I know that we're a little.

305
00:33:17.210 --> 00:33:21.359
FQ Victor Estrada: I'm okay on time, if you wanna… Okay. Yeah.

306
00:33:21.600 --> 00:33:26.699
FQ Alex Kearns: Great. So I was wondering, I mean, you've worked with a lot of different customers…

307
00:33:26.900 --> 00:33:43.830
FQ Alex Kearns: How do you feel like some of our different customers would do with this? Like, is this something that you feel like they're gonna need their IT person side-by-side, or they might be able to work with if their IT team had, like, a document like you were given, they might be able to get started? What's kind of your opinion on that?

308
00:33:43.830 --> 00:33:49.659
FQ Victor Estrada: I think it really depends on the team. I think… if I'm thinking of a technical team, then…

309
00:33:49.900 --> 00:34:04.619
FQ Victor Estrada: like, I think that if it's an IT team doing this, they would kind of run through this pretty easily. If it is, like, an IT team and, let's say, a combination of ITT and accounting, then if I'm thinking of, like, the clients that have had that range.

310
00:34:05.460 --> 00:34:07.309
FQ Victor Estrada: If it's, like, the least…

311
00:34:07.350 --> 00:34:18.279
FQ Victor Estrada: technical, then I think for sure having an IT person walk them through this, and then maybe, like, showing them how to set up one, then they can run from it. I think that could be a…

312
00:34:18.320 --> 00:34:33.829
FQ Victor Estrada: option. If they have, like, a document like this, they would definitely have questions, I think, but as long as, like, we're there to support them, as long as, like, we're enabled to help, then I think it should be fine. Let's say they're a very technical team, that understands

313
00:34:34.090 --> 00:34:36.670
FQ Victor Estrada: some of these things, I, I think, like…

314
00:34:37.120 --> 00:34:42.699
FQ Victor Estrada: I think from, like, my standpoint, like, the most technical team that I have, I think, will still have, like.

315
00:34:43.380 --> 00:34:59.780
FQ Victor Estrada: like, questions around APIs, just because it's not a typical thing that I think an accountant sets up. So I think as long as they have, like, an IT team that can help, or if we are kind of enabled enough throughout this whole thing to provide that support, then I think it would

316
00:34:59.890 --> 00:35:03.090
FQ Victor Estrada: It would help a lot more than the current process that we have.

317
00:35:03.410 --> 00:35:04.930
FQ Alex Kearns: Okay, awesome.

318
00:35:04.930 --> 00:35:12.760
FQ Victor Estrada: Yeah, but I do think that this is a great, great step in, like, the right direction. I'm excited, because I think it would help

319
00:35:12.760 --> 00:35:26.179
FQ Victor Estrada: from, like, a setup perspective, on my end, I think it would, help tremendously, being able to kind of, like, even if it's me just walking through the client, like, if they… or sitting down with the IT team and saying, like, look at this feature we have, like.

320
00:35:26.570 --> 00:35:31.760
FQ Victor Estrada: You would just follow these steps, as long as you have this information, you can kind of finalize it pretty quickly.

321
00:35:31.920 --> 00:35:41.959
FQ Alex Kearns: Okay, awesome. Yeah, I think that those were my questions. I just want to echo, too, like, the rest of the team's sentiment. I think,

322
00:35:42.540 --> 00:35:48.079
FQ Alex Kearns: You probably know when you're, like, look… when you've looked at something too long, it's really hard to kind of have

323
00:35:48.900 --> 00:36:01.869
FQ Alex Kearns: a different view on it, right? And especially, like, you're so close to the customer, I think having that feedback and, like, looking at some of the language is just, like, really helpful. So thank you so much for that, really appreciate it.

324
00:36:01.870 --> 00:36:12.180
FQ Victor Estrada: Amazing, awesome. Well, if there's, if there is anything else, like I said, I'm more than happy to jump on another quick call, and walk through anything, so if you guys have any other questions, just let me know.

325
00:36:12.430 --> 00:36:14.919
FQ Alex Kearns: Perfect, thanks so much, Victor, have a great weekend!

326
00:36:14.920 --> 00:36:16.289
FQ Victor Estrada: You too. Thank you.

