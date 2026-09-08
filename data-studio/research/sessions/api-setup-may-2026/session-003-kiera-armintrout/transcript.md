# Transcript — Session 003

**Date:** 2026-05-08
**Study:** Connector Setup — API Connection Flow
**Participant:** Kiera Armintrout (FloQast ATC II)
**Facilitators:** Natasha Clark, Kristin Johnson

---

WEBVTT

1
00:02:21.860 --> 00:02:23.870
FQ Kristin Johnson: Hey, Natasha, we're waiting for Kira.

2
00:02:27.790 --> 00:02:28.480
FQ - Natasha Clark: Cool.

3
00:02:28.900 --> 00:02:32.509
FQ - Natasha Clark: I just, move down to the basement.

4
00:02:33.490 --> 00:02:37.339
FQ Kristin Johnson: I feel like Victor carried a lot of context into that meeting.

5
00:02:38.660 --> 00:02:39.159
FQ Kristin Johnson: put the loan.

6
00:02:39.250 --> 00:02:40.160
FQ - Natasha Clark: Ew.

7
00:02:41.070 --> 00:02:44.940
FQ Kristin Johnson: Even with the information now, I think there's… there still would have been a difference.

8
00:02:46.290 --> 00:02:47.370
FQ Kiera Armintrout: Hello!

9
00:02:47.590 --> 00:02:48.060
FQ Kristin Johnson: Hello!

10
00:02:48.780 --> 00:02:51.679
FQ Kiera Armintrout: I'm a few minutes late there, my last sink ran over.

11
00:02:52.770 --> 00:02:54.570
FQ Kristin Johnson: Hilarious.

12
00:02:54.620 --> 00:03:06.680
FQ Kristin Johnson: Thank you very much for taking this meeting with us. First things first, we're recording this meeting, are you okay with the meeting being recorded? And again, we're just gonna use it, like, parse out insights for Natasha and I.

13
00:03:06.680 --> 00:03:20.850
FQ Kristin Johnson: So Natasha and I are both designers on the Data Studio project, which, you know, is all about adding more connectors to Flowcast, and then hopefully lowering the playing field so more customers can actually do those connections themselves. So…

14
00:03:21.050 --> 00:03:40.110
FQ Kristin Johnson: What we've asked you to do here today, we have a design for you to go through, and we want you to help us break it, because we feel like, like, we've all been looking at it, we're way too familiar with it, we're not familiar with the customer perspective, so we're asking you to come in and start pushing on that design so we can find the weaknesses.

15
00:03:40.200 --> 00:03:53.510
FQ Kristin Johnson: And it's… so we're gonna have a couple of product managers join us. They're… they're actually having a follow-up conversation with Victor, because he just went before you. Okay. So they'll be… they'll be popping in, too, so you'll have lots of eyes on you. I'm sorry to put you on the spot.

16
00:03:53.510 --> 00:03:54.990
FQ Kiera Armintrout: It's okay. Like, we're…

17
00:03:54.990 --> 00:03:58.580
FQ Kristin Johnson: Totally not testing you, we're testing the design, you're just helping. Okay.

18
00:03:59.510 --> 00:04:03.150
FQ Kiera Armintrout: Probably a good test subject, because I don't know anything about APIs.

19
00:04:03.150 --> 00:04:05.999
FQ - Natasha Clark: That kind of answers your first question.

20
00:04:06.000 --> 00:04:12.890
FQ Kristin Johnson: So some of the things that super help us with, with all of this is…

21
00:04:13.540 --> 00:04:30.160
FQ Kristin Johnson: you know, a speak aloud protocol, just as you're, you know, kind of voicing what you're thinking, and then, be candid. Like, you cannot hurt our feelings. Like, the whole point of having you here is for you to be like, that's bad, I don't like that, this is confu- you know, customers will find this confusing.

22
00:04:30.660 --> 00:04:36.019
FQ Kristin Johnson: So please feel free to be candid, and definitely, you know, when you're struggling.

23
00:04:36.560 --> 00:04:45.520
FQ Kristin Johnson: you know, just express yourself. We're gonna let you struggle, because again, that's the point, is letting design fail. So I'm sorry to make it feel awkward and horrible, but…

24
00:04:45.520 --> 00:04:46.659
FQ Kiera Armintrout: No, it's okay.

25
00:04:46.660 --> 00:04:56.849
FQ Kristin Johnson: you know, we're like, obviously, like, okay, the design has a weakness. Can she solve it? No. Okay, we need to go back and fix that. So I will,

26
00:04:57.710 --> 00:05:12.519
FQ Kristin Johnson: I'm gonna hand everything to Natasha, because she's gonna actually moderate the session. I kind of… and Natasha, I'm sorry, like, I'm just in the flow, like, I just jumped in. But anyway, this is actually a Natasha's session, so I will shut up and let her drive.

27
00:05:12.960 --> 00:05:22.320
FQ - Natasha Clark: Oh, no worries. And I mean, there might actually be a point, Kristen, where I might need you to take over, because since I'm in the basement, my internet connection is wonky.

28
00:05:24.070 --> 00:05:41.070
FQ - Natasha Clark: So, Kira, I'm going to send a link in the chat for you to open, and if you could please share your screen, and then I'm also, on Slack, gonna send you a document that is…

29
00:05:41.880 --> 00:05:48.429
FQ - Natasha Clark: sort of… It's, it's our… what's the right word?

30
00:05:49.300 --> 00:06:05.549
FQ - Natasha Clark: it's similar to the type of documentation that might be provided to a customer, like a less technical customer, by their internal IT team about, like, how to set up an API. So I'm… it's gonna be a Word doc, so I'm sending it to you.

31
00:06:06.410 --> 00:06:07.120
FQ - Natasha Clark: I see.

32
00:06:07.120 --> 00:06:08.459
FQ Kiera Armintrout: Can you see my screen?

33
00:06:08.810 --> 00:06:14.029
FQ Kristin Johnson: Yeah, it's loaded. Do you know how to do the Chrome side-by-side view?

34
00:06:14.030 --> 00:06:16.470
FQ Kiera Armintrout: Yes, I can put something if you want the…

35
00:06:16.470 --> 00:06:24.819
FQ Kristin Johnson: That'd be helpful, because you're probably going to be doing some copying and pasting, that way we can see exactly what you're doing with both, you know, how you're managing both of them.

36
00:06:25.760 --> 00:06:30.629
FQ - Natasha Clark: Okay. Sorry, that took a second. It's uploading and it's gonna send to you. No worries.

37
00:06:30.630 --> 00:06:32.320
FQ Kiera Armintrout: A moment. Got it.

38
00:06:32.320 --> 00:06:34.040
FQ - Natasha Clark: Cool.

39
00:06:35.350 --> 00:06:37.879
FQ - Natasha Clark: And so, if you could also just open that…

40
00:06:38.100 --> 00:06:42.850
FQ - Natasha Clark: And use that as your guidance to go through this.

41
00:06:42.860 --> 00:07:00.030
FQ - Natasha Clark: I don't remember if Kristen mentioned it, but in general, we are just… we're gonna watch you go through this. Again, not a test of you and your abilities, more of a test of how user-friendly this is for, somebody who's not, like, an IT manager or, like, a data manager.

42
00:07:00.120 --> 00:07:02.720
FQ - Natasha Clark: And…

43
00:07:02.920 --> 00:07:10.250
FQ - Natasha Clark: So, use this as your guidance. You can ask questions if you hit a stopping point, but we may or may not answer them.

44
00:07:10.810 --> 00:07:14.030
FQ - Natasha Clark: And…

45
00:07:14.130 --> 00:07:20.139
FQ - Natasha Clark: I think that's… I think that's it. Kristen already went over, please, like, speak out loud as you're going.

46
00:07:20.800 --> 00:07:24.119
FQ Kristin Johnson: Natasha, can you do the three upfront questions? Or do you want me to ask those?

47
00:07:24.130 --> 00:07:26.300
FQ - Natasha Clark: I can do the three.

48
00:07:26.300 --> 00:07:26.740
FQ Kristin Johnson: Oh, God.

49
00:07:26.740 --> 00:07:31.370
FQ - Natasha Clark: I do have them, let me just find that Chrome window.

50
00:07:36.610 --> 00:07:37.530
FQ - Natasha Clark: There it is.

51
00:07:37.860 --> 00:07:45.559
FQ - Natasha Clark: So, just 3 quick questions. A scale of 1 to 5, 1 being, sort of.

52
00:07:46.540 --> 00:07:56.519
FQ - Natasha Clark: zero knowledge of something, not at all, versus 5 being, like, absolutely yes. How knowledgeable are you about technical things like APIs?

53
00:07:58.180 --> 00:08:02.070
FQ Kiera Armintrout: I feel like… a 1.

54
00:08:02.070 --> 00:08:03.290
FQ - Natasha Clark: I agree.

55
00:08:03.290 --> 00:08:11.390
FQ Kiera Armintrout: I talk a lot about APIs with clients, but I've never had to build one. Like, I understand what it's doing, but I've never had to really do more than just kind of…

56
00:08:11.810 --> 00:08:14.919
FQ Kiera Armintrout: Walk them through, or, like, give them guides to do it on their own.

57
00:08:15.230 --> 00:08:19.099
FQ - Natasha Clark: So not a completely foreign concept, but you're also not super well-versed.

58
00:08:19.100 --> 00:08:20.530
FQ Kiera Armintrout: Yeah, exactly.

59
00:08:21.180 --> 00:08:29.659
FQ - Natasha Clark: Alright, and then how technically challenging do you anticipate this process of, building an API connection to be?

60
00:08:31.600 --> 00:08:33.739
FQ Kiera Armintrout: I feel like?

61
00:08:34.520 --> 00:08:41.270
FQ Kiera Armintrout: from what I've heard, probably hard, but I'm excited to see how you guys are making it easier.

62
00:08:41.619 --> 00:08:43.399
FQ - Natasha Clark: So, out of the 1 to 5 scale.

63
00:08:43.400 --> 00:08:50.610
FQ Kiera Armintrout: Oh, probably, like, a… a 4. I'm not… I feel like the… the… yeah, I'll go with 4. Okay.

64
00:08:51.090 --> 00:08:56.779
FQ - Natasha Clark: And then, similar question, how much effort do you think you'll have to put in to complete the process?

65
00:08:57.130 --> 00:09:01.109
FQ - Natasha Clark: Like, how much work do you think you're gonna have to do to set up an API connector?

66
00:09:01.380 --> 00:09:03.250
FQ Kiera Armintrout: Maybe also, like, a 4?

67
00:09:05.080 --> 00:09:05.690
FQ - Natasha Clark: Cool.

68
00:09:05.810 --> 00:09:20.719
FQ - Natasha Clark: Well, let's see if that… if this matches your, your expectations. You can go ahead and get started, and again, just talk us through what you're thinking, why you click a button, why you choose something, when you're looking at the UI.

69
00:09:21.840 --> 00:09:30.299
FQ Kiera Armintrout: Okay. Is there, like, a… a scenario of, like, this is a client who's building an API connection for

70
00:09:31.190 --> 00:09:35.920
FQ Kiera Armintrout: like, account… it gives us AP accounts we're trying to build a connection for.

71
00:09:36.810 --> 00:09:52.439
FQ - Natasha Clark: Yeah, I mean, in this scenario, it would be a customer who wants to come in and just, like, generally connect their data to Flowcast so that they can use the closed product. And so they need to tell us where to get that information so that we can have…

72
00:09:52.870 --> 00:09:56.189
FQ - Natasha Clark: They're, like, balances, transactions, etc.

73
00:09:56.780 --> 00:09:57.550
FQ Kiera Armintrout: Okay.

74
00:09:57.690 --> 00:10:03.650
FQ Kiera Armintrout: Well, I'm gonna start by just looking a little bit more in-depth at this guide, just to see…

75
00:10:03.880 --> 00:10:09.820
FQ Kiera Armintrout: what's in here? So, starting with kind of just some of this information.

76
00:10:09.820 --> 00:10:15.629
FQ - Natasha Clark: And while you're looking at this guide, is there anything that jumps out to you as being like, oh, I don't…

77
00:10:15.730 --> 00:10:22.089
FQ - Natasha Clark: I don't know about that, or something feels like… It might… you're anticipating might…

78
00:10:22.420 --> 00:10:25.970
FQ - Natasha Clark: Give you an issue because of how it reads.

79
00:10:27.220 --> 00:10:30.930
FQ Kiera Armintrout: I feel like on the setup side of things, I'm used to…

80
00:10:31.170 --> 00:10:47.129
FQ Kiera Armintrout: guides being, like, extremely detailed with, like, here, open this up, click here, do this. So it's definitely a little bit different, just seeing, kind of, how the IT side works, where it's a little bit more, like, data-driven, I think, rather than instruction-driven. So, I'm gonna…

81
00:10:47.130 --> 00:10:52.630
FQ Kiera Armintrout: I'm gonna see here what to do next, I guess.

82
00:10:53.250 --> 00:10:58.360
FQ Kiera Armintrout: I'm gonna click Add Connector, just to see what it brings up on this side of the screen.

83
00:10:58.660 --> 00:10:59.520
FQ Kiera Armintrout: Yeah.

84
00:10:59.860 --> 00:11:01.130
FQ Kiera Armintrout: Questions, yeah.

85
00:11:01.130 --> 00:11:07.770
FQ - Natasha Clark: In this ad connector screen, I'd love to hear your specific feedback on,

86
00:11:07.990 --> 00:11:12.479
FQ - Natasha Clark: How the information that's presented is or is not helping you.

87
00:11:12.480 --> 00:11:14.210
FQ Kiera Armintrout: Okay, sure.

88
00:11:15.180 --> 00:11:20.139
FQ Kiera Armintrout: Okay, add a connector. A few quick questions, so pre-built or custom.

89
00:11:20.480 --> 00:11:26.609
FQ Kiera Armintrout: Pre-built… okay, so that's… Something else, so in this case, probably custom.

90
00:11:27.230 --> 00:11:31.179
FQ Kiera Armintrout: I imagine, since we're building our own API here.

91
00:11:31.650 --> 00:11:33.479
FQ Kristin Johnson: Why are you assuming that?

92
00:11:34.000 --> 00:11:38.899
FQ Kristin Johnson: Like, what information are you factoring into that you assume is custom?

93
00:11:39.230 --> 00:11:47.690
FQ Kiera Armintrout: Just given, kind of, this guide. I feel like if it was,

94
00:11:48.090 --> 00:11:52.789
FQ Kiera Armintrout: How do I go back? If I was… oh, wait, edit. If it was pre-built.

95
00:11:53.600 --> 00:11:58.720
FQ Kiera Armintrout: I feel like that is stuff that we typically do on the setup side of things.

96
00:11:58.920 --> 00:12:10.260
FQ Kiera Armintrout: And maybe that's my own bias coming from the setup team, but integrations for, like, QBO, NetSuite, Sage Intact, I feel like we do those connections more just directly in the system.

97
00:12:10.630 --> 00:12:16.429
FQ Kiera Armintrout: like, in the Flowcast admin settings page. Or is this… well, I guess the option is here, so is that…

98
00:12:16.910 --> 00:12:26.279
FQ Kiera Armintrout: like, when would this, I guess, connector be used? Is this replacing, potentially, doing that, or would that still exist in the tool where you could connect?

99
00:12:26.550 --> 00:12:28.560
FQ Kiera Armintrout: In the admin settings page.

100
00:12:30.470 --> 00:12:36.269
FQ - Natasha Clark: I think the ultimate goal is that

101
00:12:36.480 --> 00:12:39.399
FQ - Natasha Clark: setting up data flows through Data Studio.

102
00:12:39.880 --> 00:12:48.220
FQ - Natasha Clark: how… at what point in time that will be the case is, is another mystery. But…

103
00:12:48.330 --> 00:12:57.819
FQ - Natasha Clark: This, the idea here is that instead of going through, sort of, the current process, we would, like, everything flows through here.

104
00:12:58.010 --> 00:12:59.889
FQ - Natasha Clark: In terms of setting up connections.

105
00:13:00.520 --> 00:13:01.250
FQ Kiera Armintrout: Okay.

106
00:13:01.690 --> 00:13:11.640
FQ Kiera Armintrout: So I guess it would maybe depend on exactly what the IT team was trying to do. Like, if they were connecting NetSuite, they would probably just connect there.

107
00:13:11.920 --> 00:13:17.370
FQ Kiera Armintrout: In this case… I guess I don't exactly know…

108
00:13:18.230 --> 00:13:21.099
FQ Kiera Armintrout: what I'm trying to do. I think…

109
00:13:21.240 --> 00:13:25.930
FQ Kiera Armintrout: is… is that, like, I'm doing a pre-built or custom for this use case.

110
00:13:31.060 --> 00:13:32.749
FQ - Natasha Clark: And what do you think…

111
00:13:32.950 --> 00:13:42.579
FQ - Natasha Clark: is there anything in the UI or the descriptions? And I… I'm asking this specifically because we… the… the…

112
00:13:42.840 --> 00:14:01.350
FQ - Natasha Clark: the API connection details document that we've provided you is, like, is an example of what could be provided to somebody, and we generally just don't have control over what, an internal team, an IT team provides to their team for… for these resources. So is there anything you can

113
00:14:01.650 --> 00:14:02.970
FQ - Natasha Clark: think of…

114
00:14:03.260 --> 00:14:10.800
FQ - Natasha Clark: at the moment, when you're looking at this UI, that would help get you over that line to feel more confident in your decision.

115
00:14:12.980 --> 00:14:15.589
FQ Kiera Armintrout: Just kind of looking at…

116
00:14:15.980 --> 00:14:22.280
FQ Kiera Armintrout: like, any of this information, like Acme, ERP, JSON as the data format.

117
00:14:22.440 --> 00:14:27.330
FQ Kiera Armintrout: I don't recognize that as anything coming from one of the pre-built connections, but…

118
00:14:28.320 --> 00:14:33.780
FQ Kiera Armintrout: I would… if I were probably more on the IT side, I would know a little bit more confidently.

119
00:14:35.200 --> 00:14:41.950
FQ Kiera Armintrout: But yeah, just seeing that kind of up top, Not saying that is…

120
00:14:42.520 --> 00:14:50.609
FQ Kiera Armintrout: maybe, like, I don't see anything here that's, like, NetSuite, Oracle, intact, so since I don't recognize any of them directly, I'd probably go with Custom.

121
00:14:50.970 --> 00:14:51.540
FQ - Natasha Clark: Okay.

122
00:14:52.650 --> 00:14:54.820
FQ Kiera Armintrout: Okay, so I'm gonna click custom.

123
00:14:55.000 --> 00:15:01.349
FQ Kiera Armintrout: And then, which connection type? I'm seeing API here, so I'm gonna go with API.

124
00:15:02.770 --> 00:15:05.410
FQ Kiera Armintrout: And then continue. That's easy.

125
00:15:05.840 --> 00:15:06.750
FQ Kiera Armintrout: Okay.

126
00:15:06.870 --> 00:15:14.330
FQ Kiera Armintrout: So… Enter the API-based URL and authentication credentials. So this is where I'm seeing… Lots of this.

127
00:15:15.060 --> 00:15:19.110
FQ Kiera Armintrout: Information… okay, connector name.

128
00:15:21.670 --> 00:15:25.619
FQ Kiera Armintrout: Connection settings, base URL, Workday payroll.

129
00:15:37.280 --> 00:15:38.410
FQ Kiera Armintrout: Thank you.

130
00:15:43.940 --> 00:15:48.070
FQ Kiera Armintrout: Is… so the connector name, that can really just be anything that you want, it looks like.

131
00:15:48.350 --> 00:15:53.530
FQ Kiera Armintrout: So maybe… Oh yeah, so maybe just…

132
00:15:53.910 --> 00:15:56.069
FQ Kristin Johnson: And how did you come to that understanding?

133
00:15:58.500 --> 00:16:07.580
FQ Kiera Armintrout: I guess, right there, the date that you'll see in this connection for Data Studio. It's using the little help center, or the little question mark next to it.

134
00:16:08.250 --> 00:16:14.729
FQ Kristin Johnson: But you hadn't seen that before, so you… somehow you surmised that you could call it anything. How did you make that… that…

135
00:16:15.080 --> 00:16:16.490
FQ Kristin Johnson: Determination.

136
00:16:16.490 --> 00:16:23.679
FQ Kiera Armintrout: I think this example of the Workday payroll, that seems more general, so this could probably just be…

137
00:16:24.070 --> 00:16:34.010
FQ Kiera Armintrout: anything, and since this is the first thing that I see on the right at the top, just makes me think that the connector name is probably something you can come up with on your own.

138
00:16:34.010 --> 00:16:40.769
FQ Kristin Johnson: Okay, because one thing I noticed, it did take you a while to discover the tooltips, so do you have a recommendation for us in terms of, like.

139
00:16:40.970 --> 00:16:44.839
FQ Kristin Johnson: to use Natasha's language, what would help a customer get over that hurdle?

140
00:16:46.670 --> 00:16:59.169
FQ Kiera Armintrout: I think maybe it's just the first time seeing it, because now that I see it, I'm like, oh, that's pretty obvious that that's there, and I'm gonna use that for the rest of them. It just took me a second to get there, I guess.

141
00:16:59.340 --> 00:17:00.260
FQ Kiera Armintrout: So maybe…

142
00:17:00.260 --> 00:17:00.850
FQ Kristin Johnson: it again.

143
00:17:00.850 --> 00:17:01.379
FQ Kiera Armintrout: Thank you a lot.

144
00:17:01.380 --> 00:17:01.940
FQ Kristin Johnson: Catherine's been.

145
00:17:01.940 --> 00:17:05.559
FQ Kiera Armintrout: Yeah, maybe on the first page being, like, or up at the top.

146
00:17:07.099 --> 00:17:13.330
FQ Kiera Armintrout: at the very beginning, just maybe saying, like, there's… if you have questions, like, include… I don't know, I don't…

147
00:17:13.819 --> 00:17:18.430
FQ Kiera Armintrout: I feel like that's probably not… Yeah.

148
00:17:18.920 --> 00:17:21.950
FQ Kiera Armintrout: Now that I'm looking at it, I'm like, it's right there in front of me.

149
00:17:21.950 --> 00:17:24.500
FQ Kristin Johnson: No, no, but this is the thing, this is the thing.

150
00:17:24.500 --> 00:17:26.150
FQ - Natasha Clark: It's a data point for us.

151
00:17:26.150 --> 00:17:31.859
FQ Kristin Johnson: Yeah, they never find those. It's, like, that's a reality, so… Okay. But again, helpful, so thank you.

152
00:17:31.860 --> 00:17:34.860
FQ Kiera Armintrout: Yeah, so maybe just something that could say.

153
00:17:35.230 --> 00:17:40.419
FQ Kiera Armintrout: Next to each title, there's more information, or like, please see,

154
00:17:40.870 --> 00:17:46.060
FQ Kiera Armintrout: the button next to each name, something like that. But here.

155
00:17:46.270 --> 00:17:52.190
FQ Kiera Armintrout: It says this could be your name, so I'll just say the ERP.

156
00:17:53.700 --> 00:17:59.979
FQ Kiera Armintrout: And then… so I just took that URL from here, the health check, this is the…

157
00:17:59.980 --> 00:18:02.179
FQ Kristin Johnson: Because it's… that's just…

158
00:18:02.180 --> 00:18:04.039
FQ Kiera Armintrout: This one? Okay. Yeah.

159
00:18:04.740 --> 00:18:07.909
FQ Kiera Armintrout: Environment, production, I see that there.

160
00:18:08.580 --> 00:18:15.999
FQ Kiera Armintrout: API version… Required by some APIs, check your docs, leave blank if not listed. I don't see…

161
00:18:16.430 --> 00:18:19.669
FQ Kiera Armintrout: API version, so I'm just gonna leave that blank.

162
00:18:20.370 --> 00:18:27.420
FQ Kiera Armintrout: Authentication type, API key… Go there…

163
00:18:28.430 --> 00:18:33.090
FQ Kiera Armintrout: Send API key via where your API should be placed.

164
00:18:35.080 --> 00:18:43.449
FQ Kiera Armintrout: Send API key… header… We really record this book today.

165
00:18:44.570 --> 00:18:54.259
FQ Kiera Armintrout: Oh, header. Okay, correct. Authorization header name… X… API key. Okay.

166
00:18:55.190 --> 00:18:56.730
FQ Kiera Armintrout: Test connection.

167
00:18:56.910 --> 00:18:59.510
FQ Kiera Armintrout: To find… endpoints, yeah.

168
00:18:59.510 --> 00:19:12.250
FQ - Natasha Clark: It feels like you were starting to feel more confident once you got past that top section. And do you feel like that was just, in general, getting over that first hurdle and, like…

169
00:19:12.790 --> 00:19:18.020
FQ - Natasha Clark: Knowing that you could rely on the documentation versus something else.

170
00:19:18.610 --> 00:19:34.180
FQ Kiera Armintrout: Yeah, and I think just even starting to see the matches, exactly that, of just knowing, oh, it's all listed out here, I can just pull it directly, that made me feel more confident too, knowing that this is all listed for me, just directly on the other document.

171
00:19:40.080 --> 00:19:41.180
FQ - Natasha Clark: Let's keep going.

172
00:19:41.590 --> 00:19:43.979
FQ Kiera Armintrout: Endpoint name here.

173
00:19:44.100 --> 00:19:47.089
FQ Kiera Armintrout: And each API endpoint you want to sync.

174
00:19:48.490 --> 00:19:55.830
FQ Kiera Armintrout: Okay, so we're doing number one is the general ledger entries, so I'll just call it that.

175
00:20:00.640 --> 00:20:02.680
FQ Kiera Armintrout: the endpoint path…

176
00:20:09.560 --> 00:20:12.039
FQ Kiera Armintrout: And then change frequency.

177
00:20:19.950 --> 00:20:22.009
FQ Kristin Johnson: Why did you choose occasional there?

178
00:20:22.240 --> 00:20:30.970
FQ Kiera Armintrout: I don't know, I'm still confirming which one I want to choose. Endpoints.

179
00:20:30.970 --> 00:20:33.709
FQ Kristin Johnson: Do you know what we're… what is changing?

180
00:20:34.610 --> 00:20:39.600
FQ Kiera Armintrout: Would that just be… The change frequency.

181
00:20:40.160 --> 00:20:42.090
FQ Kiera Armintrout: No.

182
00:20:42.330 --> 00:20:46.519
FQ Kristin Johnson: Okay, and that's okay, we're… I think we're gonna kill this anyway, so that's all good.

183
00:20:46.910 --> 00:20:50.130
FQ Kristin Johnson: I'm curious, because you seem very, like, oh yeah, I'm gonna make this change, or…

184
00:20:50.130 --> 00:20:52.290
FQ Kiera Armintrout: No, that one I'm not sure about.

185
00:20:52.290 --> 00:20:54.340
FQ Kristin Johnson: Okay, that's totally fine.

186
00:20:54.340 --> 00:20:55.910
FQ Kiera Armintrout: Yeah, that one I wouldn't.

187
00:20:56.320 --> 00:21:00.079
FQ Kiera Armintrout: I wouldn't know for sure. But, it looks like we can…

188
00:21:00.640 --> 00:21:07.579
FQ Kiera Armintrout: I think that's all we need for this one, and we want to add, it looks like, a couple other endpoints here, so I think this would be…

189
00:21:08.150 --> 00:21:11.409
FQ - Natasha Clark: And don't feel like you need to… there's a few different ones listed in the doc, don't feel like you need.

190
00:21:11.410 --> 00:21:13.330
FQ Kiera Armintrout: Oh, perfect, we just do the first one?

191
00:21:13.620 --> 00:21:15.480
FQ - Natasha Clark: We do the first one or two.

192
00:21:15.680 --> 00:21:17.410
FQ Kiera Armintrout: Okay, I'll do the second one.

193
00:21:17.880 --> 00:21:24.440
FQ Kiera Armintrout: Accounts payable voices… We'll do this one.

194
00:21:24.780 --> 00:21:28.179
FQ Kiera Armintrout: Same, we'll just sleep that for now. But, okay.

195
00:21:28.520 --> 00:21:32.190
FQ Kiera Armintrout: So I could go ahead and just do those two to start.

196
00:21:32.310 --> 00:21:34.810
FQ Kiera Armintrout: I click next. Okay, so now we're in the…

197
00:21:34.810 --> 00:21:39.129
FQ Kristin Johnson: Probably need to stop your screen share, because we're gonna get… you're gonna get squashed here.

198
00:21:39.130 --> 00:21:39.620
FQ Kiera Armintrout: Okay.

199
00:21:39.620 --> 00:21:40.689
FQ - Natasha Clark: You mean the dual screen?

200
00:21:41.290 --> 00:21:41.830
FQ Kiera Armintrout: Yeah.

201
00:21:43.700 --> 00:21:44.360
FQ Kiera Armintrout: Okay.

202
00:21:45.170 --> 00:21:51.379
FQ Kiera Armintrout: So now I see we're in our endpoint, so this is the general ledger's entry that I'm working in to start.

203
00:21:53.330 --> 00:22:00.799
FQ Kiera Armintrout: Okay, let's see… endpoints, HTTP method… Get post patch.

204
00:22:01.640 --> 00:22:04.970
FQ Kiera Armintrout: retrieve. So I think that's get, because they're…

205
00:22:05.410 --> 00:22:10.780
FQ Kiera Armintrout: Retrieving the posted journal entries, so it's getting the information.

206
00:22:10.780 --> 00:22:11.470
FQ Kristin Johnson: And to…

207
00:22:11.470 --> 00:22:11.870
FQ Kiera Armintrout: Yes.

208
00:22:11.870 --> 00:22:13.320
FQ Kristin Johnson: in my decision.

209
00:22:13.750 --> 00:22:14.520
FQ Kiera Armintrout: What?

210
00:22:14.520 --> 00:22:16.250
FQ Kristin Johnson: How are you making that decision?

211
00:22:16.250 --> 00:22:20.000
FQ Kiera Armintrout: I think just… Knowing that it's…

212
00:22:20.360 --> 00:22:28.460
FQ Kiera Armintrout: it's taking the information from this new ERP and pulling it into Flowcast, in my mind, would be the, like, we're getting it from the…

213
00:22:28.750 --> 00:22:30.000
FQ Kiera Armintrout: ERP.

214
00:22:30.190 --> 00:22:37.850
FQ Kiera Armintrout: Versus a post would be, like, updating something or pushing something back into the original ERP.

215
00:22:37.970 --> 00:22:39.969
FQ Kiera Armintrout: I don't know what patch is, but…

216
00:22:40.140 --> 00:22:52.400
FQ Kiera Armintrout: I would assume for those first two, get and post, it would be, like, receiving versus pushing it back to the ERP system. So, taking it into Flowcast versus sending it back. So, I think in this case, we're getting it, so…

217
00:22:52.510 --> 00:22:55.110
FQ Kiera Armintrout: That's what I would say there. I guess you could also look.

218
00:22:55.310 --> 00:22:58.299
FQ Kiera Armintrout: At this little question mark.

219
00:22:58.540 --> 00:23:08.100
FQ Kiera Armintrout: How to pull data, so… Whether Flowcast fetches only new records, uses a bookmark, or re-pulls everything each sync.

220
00:23:09.470 --> 00:23:12.560
FQ Kiera Armintrout: I think maybe that would depend on what

221
00:23:13.040 --> 00:23:17.800
FQ Kiera Armintrout: You wanted, if you wanted everything to resync each time.

222
00:23:19.050 --> 00:23:31.579
FQ Kiera Armintrout: I think, for only new records, I think probably want a full refresh, because I would want to make sure everything's getting updated each time, rather than just the new information.

223
00:23:32.080 --> 00:23:37.610
FQ Kiera Armintrout: And it looks like the response format is the JSON, so that's…

224
00:23:37.760 --> 00:23:41.760
FQ Kiera Armintrout: I think that's good, that's what I see in the API connection document.

225
00:23:46.210 --> 00:23:48.600
FQ Kiera Armintrout: Free, please. Okay.

226
00:23:49.170 --> 00:23:54.430
FQ Kiera Armintrout: So then… query parameters…

227
00:23:54.850 --> 00:24:00.160
FQ Kiera Armintrout: Okay, so we have a few, and those are listed on the document, so I'm just gonna start with…

228
00:24:00.360 --> 00:24:10.269
FQ Kiera Armintrout: the date from… The value, just make sure this… the value to send for this parameter.

229
00:24:11.410 --> 00:24:13.020
FQ Kiera Armintrout: Unreach request.

230
00:24:15.340 --> 00:24:16.910
FQ Kiera Armintrout: Value type.

231
00:24:22.010 --> 00:24:25.830
FQ Kiera Armintrout: Gonna go with string. Oh wait, this one's a date, just kidding.

232
00:24:26.490 --> 00:24:27.250
FQ Kiera Armintrout: Great.

233
00:24:27.250 --> 00:24:28.909
FQ - Natasha Clark: Did you change your mind on that?

234
00:24:29.100 --> 00:24:41.360
FQ Kiera Armintrout: I think when I saw date, at first I just didn't know what the other ones meant, so I just was gonna keep string, but I think because this one is a date, and I saw that as an option, that would make me think that we could do date there.

235
00:24:43.220 --> 00:24:54.379
FQ Kiera Armintrout: And then, for value… Since this is the value sent for this perimeter on every request.

236
00:24:55.820 --> 00:25:02.150
FQ Kiera Armintrout: I think, would this be just the generic description versus the example value?

237
00:25:02.350 --> 00:25:05.020
FQ Kiera Armintrout: Or would you put the example value?

238
00:25:08.090 --> 00:25:10.340
FQ Kiera Armintrout: The value to send for this parameter.

239
00:25:11.340 --> 00:25:19.090
FQ Kiera Armintrout: I think you'd probably use, like, a general format, rather than the actual example, because then that would send every time, I think.

240
00:25:19.890 --> 00:25:21.359
FQ Kiera Armintrout: That would be my guess.

241
00:25:22.010 --> 00:25:26.579
FQ - Natasha Clark: And… Well, you said you think, so do you have, like…

242
00:25:27.000 --> 00:25:29.799
FQ - Natasha Clark: Is there, like, a… is there, sort of.

243
00:25:30.180 --> 00:25:33.299
FQ - Natasha Clark: Past knowledge that makes you make that assumption?

244
00:25:34.980 --> 00:25:42.579
FQ Kiera Armintrout: I think I would just… so the wording, if it's saying this is the value for this perimeter on every request.

245
00:25:42.820 --> 00:25:45.830
FQ Kiera Armintrout: I would be hesitant to put in this

246
00:25:46.830 --> 00:25:54.740
FQ Kiera Armintrout: like, example value, because then I would be worried maybe that that would be the value it would bring in every single time, versus this would be…

247
00:25:55.360 --> 00:26:02.119
FQ Kiera Armintrout: the more general value, so that's the format it's supposed to read, would be kind of how I'm… how I'm reading that.

248
00:26:05.950 --> 00:26:09.210
FQ Kiera Armintrout: But… What does that look like?

249
00:26:09.210 --> 00:26:11.789
FQ Kristin Johnson: It said, what if that label said example value?

250
00:26:12.890 --> 00:26:13.600
FQ Kiera Armintrout: Yeah.

251
00:26:14.080 --> 00:26:17.700
FQ Kiera Armintrout: I think that would be… Yeah.

252
00:26:17.970 --> 00:26:19.579
FQ Kiera Armintrout: That would be perfect.

253
00:26:20.470 --> 00:26:23.320
FQ Kiera Armintrout: From that, it's probably the example value.

254
00:26:23.710 --> 00:26:30.020
FQ Kiera Armintrout: Yeah, I think that would be helpful. Or even here, just, like, the example value to send for this.

255
00:26:30.770 --> 00:26:32.919
FQ Kiera Armintrout: Parameter for every request.

256
00:26:33.390 --> 00:26:37.669
FQ Kiera Armintrout: Cause yeah, that's listed in the guide, so that would be my initial guess, but then I just…

257
00:26:37.860 --> 00:26:41.750
FQ Kiera Armintrout: Wouldn't want to put it in there if it was gonna be like, oh, this might be…

258
00:26:42.410 --> 00:26:48.380
FQ Kiera Armintrout: And the average IT person who's building this might have a lot more knowledge of that already, but I think just…

259
00:26:48.530 --> 00:26:56.850
FQ Kiera Armintrout: having example would maybe help. And then we could add another one here, so… Date 2… And then…

260
00:26:57.150 --> 00:26:59.310
FQ Kiera Armintrout: this value…

261
00:27:00.340 --> 00:27:15.009
FQ Kiera Armintrout: Again, I'm gonna guess date, just because we're looking at a date again. Oh, and it says type. That would be another reason why I would use that, because it says it in the guide, so that's good. Just took me a second to get there. Okay.

262
00:27:15.130 --> 00:27:18.730
FQ Kiera Armintrout: And then this one would be the ledger ID.

263
00:27:19.980 --> 00:27:27.649
FQ Kiera Armintrout: the geo… 1, and then this one says string in the guide, so I would go with that.

264
00:27:29.020 --> 00:27:30.310
FQ Kiera Armintrout: Okay, oh.

265
00:27:31.860 --> 00:27:43.599
FQ Kiera Armintrout: And then… accidentally clicked that, but unclicked it when I saw that I got rid of my data. So then from here, I think you could do this schedule, so I'll just keep moving through this.

266
00:27:43.870 --> 00:27:50.130
FQ Kiera Armintrout: So… Sync mode… Full refresh, it's what we said earlier.

267
00:27:50.680 --> 00:28:02.210
FQ Kiera Armintrout: incremental ads, only new, changed records, full refresh replaces everything. I still think I would do full refresh, because we want to make sure we're getting all our most recent data, and all of our data across the whole

268
00:28:02.530 --> 00:28:06.480
FQ Kiera Armintrout: Platform, especially for… Things like journal entries.

269
00:28:07.770 --> 00:28:18.809
FQ Kiera Armintrout: I think this would probably depend on the team and how often they wanted this, but I know we work with a lot of teams that want hourly syncs.

270
00:28:19.380 --> 00:28:24.170
FQ Kiera Armintrout: So, I'm just gonna click that, because I know some teams are really wanting that frequency.

271
00:28:25.050 --> 00:28:36.360
FQ Kiera Armintrout: I think this is fairly intuitive, like, are we… do we want to go back for a previous period, or do we want it just for starting now? So I'll just go from, start from today.

272
00:28:37.220 --> 00:28:38.650
FQ Kiera Armintrout: And then…

273
00:28:40.480 --> 00:28:51.049
FQ Kiera Armintrout: I think 3. That's what it's defaulted to, so that's probably what I'd keep it to, unless a team had a more specific preference, but I think this makes sense. How many times would it…

274
00:28:51.560 --> 00:28:56.670
FQ Kiera Armintrout: Allow that… it to run with running an error before it reports it.

275
00:28:57.620 --> 00:29:00.319
FQ Kiera Armintrout: So I would feel good about this, I think.

276
00:29:00.770 --> 00:29:03.790
FQ Kiera Armintrout: And then… testing endpoint here.

277
00:29:04.180 --> 00:29:07.770
FQ Kiera Armintrout: The test passed! Yay!

278
00:29:07.770 --> 00:29:08.650
FQ - Natasha Clark: And.

279
00:29:08.650 --> 00:29:09.080
FQ Kiera Armintrout: Cool.

280
00:29:09.080 --> 00:29:16.899
FQ - Natasha Clark: That's actually the end of the prototype. There's… nothing would happen if you clicked finish. It would take you back to the beginning. Real… real quick, I want to ask…

281
00:29:17.490 --> 00:29:19.289
FQ Kristin Johnson: That second endpoint.

282
00:29:19.540 --> 00:29:20.559
FQ - Natasha Clark: That's true.

283
00:29:20.560 --> 00:29:26.079
FQ Kristin Johnson: necessarily need her to do anything, like, what do you need to do? Anything with that second endpoint?

284
00:29:27.590 --> 00:29:34.469
FQ Kiera Armintrout: I would assume you probably would need to set that up as well. Like, if you… if you haven't done anything with it.

285
00:29:35.070 --> 00:29:53.269
FQ Kiera Armintrout: that green little button maybe shows me that this is done. I know we use a lot of that in Flowcast, so this would probably show me this hasn't been done. I think just even if you add in multiple, it does have the specific endpoints for each one, so I think I would know well if I haven't set it up for

286
00:29:53.280 --> 00:29:58.919
FQ Kiera Armintrout: The accounts payable, it's different endpoints and parameters, so that would mean this probably hasn't been set up yet.

287
00:29:59.210 --> 00:30:00.599
FQ Kiera Armintrout: Okay. So it would go through that.

288
00:30:00.760 --> 00:30:03.440
FQ Kristin Johnson: Can you click back on the general ledger entries.

289
00:30:03.440 --> 00:30:03.840
FQ Kiera Armintrout: Yeah.

290
00:30:04.910 --> 00:30:05.700
FQ Kristin Johnson: Okay.

291
00:30:05.890 --> 00:30:07.520
FQ Kristin Johnson: Yeah.

292
00:30:08.260 --> 00:30:15.699
FQ Kristin Johnson: just helpful, helpful for… for… oh, actually, go, go hit the, hit the green button at the bottom that says query parameters.

293
00:30:15.990 --> 00:30:18.010
FQ Kristin Johnson: And then hit schedule.

294
00:30:18.570 --> 00:30:25.389
FQ Kristin Johnson: Okay, so it just seems like we're gonna need… there's, like, a very subtle call to action to, like, move to the next endpoint.

295
00:30:25.390 --> 00:30:34.740
FQ Kiera Armintrout: Yeah, maybe. Maybe just here, even where it says accounts payable, be, like, complete accounts payable invoices, or finalized setup for, something like that there.

296
00:30:34.740 --> 00:30:36.699
FQ Kristin Johnson: Yeah, we should just direct you.

297
00:30:36.970 --> 00:30:49.949
FQ Kiera Armintrout: Okay, perfect. Yeah. I think it makes sense that you would have to do it for each one, but even just the gentle guide of showing them where to go next, I'm sure customers are like, what do I do? Where do I go next?

298
00:30:50.190 --> 00:30:52.900
FQ Kristin Johnson: Here, we're at time, do you have a…

299
00:30:52.900 --> 00:30:54.180
FQ Kiera Armintrout: Yeah, I do.

300
00:30:56.400 --> 00:30:57.020
FQ Kiera Armintrout: Cool.

301
00:30:57.020 --> 00:31:00.660
FQ - Natasha Clark: Wait, you said you do have time to…

302
00:31:00.660 --> 00:31:01.530
FQ Kiera Armintrout: Yeah, I do.

303
00:31:01.530 --> 00:31:07.719
FQ - Natasha Clark: Okay. The other question I was gonna ask, just to get, again, about this screen, was,

304
00:31:07.900 --> 00:31:21.130
FQ - Natasha Clark: You seemed… I noticed, out of the four, sort of, options on this screen, you did not look at the help tip for sync frequency, so is it safe to say that you just… you were super comfortable with what that meant?

305
00:31:21.540 --> 00:31:23.939
FQ - Natasha Clark: Looking at it compared to the others.

306
00:31:23.940 --> 00:31:35.390
FQ Kiera Armintrout: Yeah, that one, I think, just because of the setups that we do, and setting up, like, SFTP connections, again, I don't really do the setup there, but…

307
00:31:35.390 --> 00:31:45.860
FQ Kiera Armintrout: helping them with the guides and just hosting, kind of walking them through the super high level of what they need to do, we always have to ask them, like, how often do you want to refresh your data? How often do you want those

308
00:31:45.990 --> 00:31:47.950
FQ Kiera Armintrout: you know, you're, like, let's say if it's a…

309
00:31:48.530 --> 00:32:06.020
FQ Kiera Armintrout: customer coming from Appfolio or a different ERP, they do ask, or we ask, how often would you want them to… how often would you want your data to sync and pull in from the system? And often, we always say, like, we can do up to hourly, and that's often what people want. So that's my own knowledge there, but…

310
00:32:06.360 --> 00:32:08.800
FQ Kiera Armintrout: yeah, could be, I guess, different for everyone.

311
00:32:10.160 --> 00:32:10.780
FQ - Natasha Clark: Okay.

312
00:32:11.120 --> 00:32:20.109
FQ - Natasha Clark: Well, like I said, you reached the end of the prototype, so I… well, we'll check back in about the questions.

313
00:32:20.990 --> 00:32:21.480
FQ Kiera Armintrout: Oh, yeah.

314
00:32:21.480 --> 00:32:24.180
FQ - Natasha Clark: two of the questions from the beginning. So…

315
00:32:24.740 --> 00:32:32.109
FQ - Natasha Clark: when I asked you how technically challenging did you anticipate the process to be, you said a 4. Do you… how do you feel now?

316
00:32:32.620 --> 00:32:37.259
FQ Kiera Armintrout: I feel like that was a… a 2. That was way easier than I thought it was gonna be.

317
00:32:38.350 --> 00:32:45.920
FQ - Natasha Clark: And was that more so because of anything in the UI, or the documentation that we gave you, or both?

318
00:32:46.910 --> 00:32:48.330
FQ Kiera Armintrout: That made it easier.

319
00:32:49.190 --> 00:32:59.610
FQ Kiera Armintrout: Yeah, I think just the one-to-one that you provided kind of everything that I needed, it made it easy to just copy and paste that in, even though I didn't know maybe what everything meant.

320
00:33:01.530 --> 00:33:02.140
FQ - Natasha Clark: Okay.

321
00:33:02.300 --> 00:33:15.300
FQ - Natasha Clark: And then the other, was how much effort do you think you'd put in to complete the process? The version of that question that I want to ask now is, like, you did one, so how much effort…

322
00:33:15.300 --> 00:33:23.059
FQ - Natasha Clark: did you feel like it was to complete this? And then knowing that that sheet had, I think, 4 total endpoints, how much effort

323
00:33:23.120 --> 00:33:27.639
FQ - Natasha Clark: And time do you think it would take if you were actually doing that setup?

324
00:33:28.900 --> 00:33:46.799
FQ Kiera Armintrout: I mean, that felt really easy. Again, maybe, like, a 2, just because for the first time going through it, I could see being a little bit more, like, how does it work? What is… what do I need to put into everything? But I feel like to do the rest, I could do it pretty quickly, now that I've seen these first ones.

325
00:33:46.920 --> 00:33:52.759
FQ Kiera Armintrout: I think it would be pretty easy to just copy and paste those in and update this with, kind of, your preferences.

326
00:33:54.730 --> 00:33:57.679
FQ - Natasha Clark: So if you had to put, like, a number of minutes…

327
00:33:59.350 --> 00:34:03.709
FQ Kiera Armintrout: to do the other… well, so I did two, so I'd say to do the remaining two, maybe, like…

328
00:34:04.480 --> 00:34:06.110
FQ Kiera Armintrout: 5 to 10 minutes?

329
00:34:07.690 --> 00:34:12.819
FQ Kiera Armintrout: Because it's all laid out for me. That would probably just be to double check that I didn't do anything incorrectly.

330
00:34:12.820 --> 00:34:13.190
FQ - Natasha Clark: Agreed.

331
00:34:15.419 --> 00:34:20.799
FQ Kiera Armintrout: Yeah, maybe, like, 5 minutes a setup for each one, with just checking as well.

332
00:34:21.659 --> 00:34:22.229
FQ - Natasha Clark: Yeah.

333
00:34:22.980 --> 00:34:24.569
FQ Kiera Armintrout: That made it really easy, though.

334
00:34:27.020 --> 00:34:27.550
FQ - Natasha Clark: That's.

335
00:34:27.550 --> 00:34:28.570
FQ Kiera Armintrout: great.

336
00:34:30.400 --> 00:34:32.419
FQ Kristin Johnson: Let's go Lilith.

337
00:34:33.360 --> 00:34:38.079
FQ Kristin Johnson: So here's the thing. We made a lot of updates based on her feedback.

338
00:34:38.080 --> 00:34:38.580
FQ Kiera Armintrout: Yeah.

339
00:34:38.870 --> 00:34:43.400
FQ Kristin Johnson: She was the guinea pig. Like, crawled on glass to get through.

340
00:34:43.400 --> 00:34:44.290
FQ Kiera Armintrout: Oh my gosh.

341
00:34:44.290 --> 00:34:53.600
FQ Kristin Johnson: Tasha, I'm gonna send her the update to be like, is this banner? Yeah. So don't go swinging in there like, Lulith, what's wrong with you? Because she, like, she paved the way for you.

342
00:34:53.600 --> 00:35:00.070
FQ Kiera Armintrout: Thank you. Thank you, Leland. Appreciate it. No, I think this looks really good. I think, if anything, just…

343
00:35:00.250 --> 00:35:05.120
FQ Kiera Armintrout: The gentle guiding of users where to go,

344
00:35:05.500 --> 00:35:21.900
FQ Kiera Armintrout: as you can see, sometimes not the most intuitive if it's a new system or something, so yeah, just even here, having that, like, complete, move next to complete your… your setup for the next one, or something like that. And then, other than that.

345
00:35:22.270 --> 00:35:25.160
FQ Kiera Armintrout: I think it's pretty straightforward.

346
00:35:25.400 --> 00:35:26.730
FQ Kiera Armintrout: Maybe?

347
00:35:27.190 --> 00:35:28.610
FQ Kiera Armintrout: I think these are…

348
00:35:29.440 --> 00:35:35.419
FQ Kiera Armintrout: this is just, now that I'm maybe done, to ask, like, the team would know this, right? What they wanted?

349
00:35:35.700 --> 00:35:38.860
FQ Kiera Armintrout: this would have to come from them. Like, they would know.

350
00:35:38.970 --> 00:35:42.010
FQ Kiera Armintrout: What they wanted, if they wanted to be incremental or not.

351
00:35:42.010 --> 00:35:42.710
FQ Kristin Johnson: They, they…

352
00:35:42.710 --> 00:35:43.590
FQ - Natasha Clark: Absolutely, yes.

353
00:35:43.590 --> 00:35:56.559
FQ Kristin Johnson: Yeah, the state of their own data, they probably do. It's more… it's more the labeling and the language and the context, right? And it's one thing if you're walking them through, but again, if our goal is at the end of the day, like, you're not even in the loop unless it gets escalated.

354
00:35:56.850 --> 00:35:57.260
FQ Kiera Armintrout: Yeah.

355
00:35:57.260 --> 00:36:02.870
FQ Kristin Johnson: You know, that the language and the presentation is enough that they're like, oh yeah, this is what they're asking for.

356
00:36:02.870 --> 00:36:03.470
FQ Kiera Armintrout: Yeah.

357
00:36:03.470 --> 00:36:06.980
FQ Kristin Johnson: Even with you walking through, I'm still like, oh, we need to fix that and that and that.

358
00:36:08.010 --> 00:36:26.699
FQ Kiera Armintrout: Yeah, maybe even just putting in the connection guide, if you didn't want it in the user face, just, like, a quick what each term means, just for people to look. I know you have it here, but even more… a little bit more detailed, maybe, if they're really starting from scratch.

359
00:36:27.030 --> 00:36:33.419
FQ Kiera Armintrout: Like, every hour means… I mean, you probably don't need to get that detailed, but…

360
00:36:34.860 --> 00:36:37.170
FQ Kiera Armintrout: Yeah, I guess it's kind of in here.

361
00:36:37.170 --> 00:36:53.319
FQ Kristin Johnson: I had that idea, like, on the tooltop, there could even be a more, right? And the more opens a little modal, and then we're pulling in Kira, whatever, like, whatever documentation you have, or if we have to create that documentation that gives them a much more extensive explanation.

362
00:36:53.320 --> 00:37:01.390
FQ Kristin Johnson: So they… so, you know, progressive disclosure, right? So they… if it's not enough information, they can dig a little deeper and hopefully get a little more clarity, is what I think it is.

363
00:37:01.390 --> 00:37:02.110
FQ Kiera Armintrout: Yeah.

364
00:37:02.530 --> 00:37:08.639
FQ - Natasha Clark: Some kind of sidebar, like, minimizable, closable type of thing, like a help

365
00:37:09.040 --> 00:37:19.840
FQ - Natasha Clark: similar to when you're in, I don't know, like, an actual software application, and you hit help, and it kind of just, like, slides out from the side, something like that.

366
00:37:20.010 --> 00:37:27.389
FQ Kiera Armintrout: Yeah, or like, I don't know if there's… will be a Help Center article for this, but even just linking to a Help Center article directly in here, and it could.

367
00:37:27.390 --> 00:37:29.660
FQ - Natasha Clark: I imagine so. Instead of the guy, which just…

368
00:37:29.660 --> 00:37:45.390
FQ Kiera Armintrout: Yeah, there's gonna have to be. But, just a list of, like, more in-depth what each thing's mean, and kind of, like, a how-to with screenshots of this. Like, here's where you click. Sometimes people really need that, of just… I know we have a lot of those for, like, how do you make

369
00:37:45.720 --> 00:38:00.239
FQ Kiera Armintrout: create an entity or something like that, even though it's pretty user-friendly. Once you're in there, people just really don't know. So having a guide that could, with screenshots, be like, once you do this, then it's this. Pull this information from the guide, here's where you can click,

370
00:38:01.520 --> 00:38:16.349
FQ Kiera Armintrout: Yeah, something like that too, but I'm sure that's down the line as well. But yeah, even… either a link to that, or maybe just something that had a little bit more information, because I think it… you might get a mix of people. If they're an IT person, they probably won't have any questions. They could do this.

371
00:38:16.570 --> 00:38:19.400
FQ Kiera Armintrout: Super easily, and know what everything means, but…

372
00:38:19.660 --> 00:38:30.920
FQ Kiera Armintrout: I know sometimes in setups, we do get people who are maybe project managers, who are just on this to help with some of this stuff, rather than either a super strong accounting or IT personnel, so having

373
00:38:31.480 --> 00:38:40.060
FQ Kiera Armintrout: more guidance would be helpful, but I do think, for the most part, this is pretty straightforward and was easy to use. I'm curious what would happen if the test failed.

374
00:38:40.290 --> 00:38:49.010
FQ Kiera Armintrout: would it be… would it guide you to, like, where… where went wrong? Would it show you, kind of, what happened, or would it be…

375
00:38:49.400 --> 00:38:52.180
FQ Kiera Armintrout: Yeah, I don't know. I don't know if we got there yet, but…

376
00:38:52.180 --> 00:38:54.100
FQ Kristin Johnson: That's a great question, yes.

377
00:38:54.100 --> 00:38:55.489
FQ - Natasha Clark: That's a good question.

378
00:38:55.490 --> 00:39:13.629
FQ Kristin Johnson: Yeah, there would… there would be something in the UI for it, because it could fail on different… it could fail on the request, it could fail on the query parameters, so we would… we would not light those areas up. Probably when you went back to that view, we would have the actual fields where it failed, and there would also be some sort of failure description of, like, fix these things, please.

379
00:39:14.740 --> 00:39:18.719
FQ Kiera Armintrout: That would be helpful, I think, just guiding them to where they would need to make changes.

380
00:39:22.160 --> 00:39:22.750
FQ Kristin Johnson: Okay.

381
00:39:22.750 --> 00:39:23.489
FQ - Natasha Clark: Yeah, so we…

382
00:39:23.490 --> 00:39:25.449
FQ Kiera Armintrout: We talked a little bit…

383
00:39:25.450 --> 00:39:31.039
FQ - Natasha Clark: Yeah, I was gonna say, we talked… we already just essentially went over, like, what you felt maybe might be missing.

384
00:39:31.150 --> 00:39:39.350
FQ - Natasha Clark: And so then my last question for you is really just, like, did you… was there anything that you found frustrating?

385
00:39:39.690 --> 00:39:41.950
FQ - Natasha Clark: About going through this?

386
00:39:48.530 --> 00:39:53.380
FQ Kiera Armintrout: Probably just my own lack of knowledge. I'm like, what? I don't know this, but I feel like…

387
00:39:53.490 --> 00:40:00.950
FQ Kiera Armintrout: Generally, it's… it's pretty easy to use. I think maybe I'm just… I am used to…

388
00:40:02.260 --> 00:40:08.940
FQ Kiera Armintrout: I've gotten spoiled with these guides that are super detailed, like, exactly this. So it's…

389
00:40:09.690 --> 00:40:24.499
FQ Kiera Armintrout: it's a good test of my critical thinking skills to be put in a situation where I don't know as much, but I still think that with these little question mark buttons, having those there, and then just having the…

390
00:40:25.450 --> 00:40:31.580
FQ Kiera Armintrout: exactly the… You know, setting information laid out for you already is helpful.

391
00:40:32.790 --> 00:40:39.570
FQ Kiera Armintrout: I don't think… If there was anything that I'm like, oh, I hate that, or that was…

392
00:40:40.650 --> 00:40:47.660
FQ Kiera Armintrout: really terrible. Even not really knowing a ton about it, I still feel like that was a fairly easy experience.

393
00:40:48.270 --> 00:40:52.200
FQ Kiera Armintrout: Like, I would hope that people would leave this and be like, oh, that was pretty easy.

394
00:40:54.700 --> 00:40:55.600
FQ - Natasha Clark: That is the

395
00:40:56.620 --> 00:41:03.359
FQ - Natasha Clark: We don't want to leave a bad taste in people's mouths, like, at their first… when they're first setting up Flowcast.

396
00:41:05.280 --> 00:41:05.720
FQ Kristin Johnson: Okay.

397
00:41:05.720 --> 00:41:08.519
FQ Kiera Armintrout: I think this is good. I can see…

398
00:41:08.860 --> 00:41:13.490
FQ Kiera Armintrout: Us helping them with the first one, and maybe, like, training them on how to…

399
00:41:14.000 --> 00:41:20.929
FQ Kiera Armintrout: Set this up, or walking them through what we did, and then encouraging them after that to do future setups on their own.

400
00:41:22.260 --> 00:41:23.990
FQ - Natasha Clark: Yeah, and there's always the possibility.

401
00:41:23.990 --> 00:41:28.950
FQ Kiera Armintrout: Is that kind of how you see it? I think that would just be the… Yeah.

402
00:41:29.280 --> 00:41:34.810
FQ - Natasha Clark: There's always the possibility that they're gonna need to come in here at a later point to set up a new…

403
00:41:35.010 --> 00:41:37.280
FQ - Natasha Clark: a new API.

404
00:41:37.610 --> 00:41:43.929
FQ - Natasha Clark: For, like, new accounts, or a new, like, service, or something like that.

405
00:41:44.140 --> 00:42:03.009
FQ - Natasha Clark: So, there's definitely… there's the, like, initial setup part, where that's where a lot of the work is going to be done, but then we also want this to continue to be, like, if they have to come in, like, 2 years into using Flowcast and add a new API connection, or, like, adjust the endpoints.

406
00:42:03.350 --> 00:42:05.700
FQ - Natasha Clark: We want it to also still be…

407
00:42:06.150 --> 00:42:11.359
FQ - Natasha Clark: Like, easy, when they're not necessarily at the point where they're gonna have, like, the ATC team holding their hand.

408
00:42:12.020 --> 00:42:21.089
FQ Kiera Armintrout: Yeah, I think that would still be okay, I'm sure. They would reach out first and be like, where do I set it up? And then the ASM could tell them, hey, here's what you need to do.

409
00:42:21.400 --> 00:42:27.109
FQ Kiera Armintrout: reach out then if you have questions. Like, try it on your own first, and hopefully they'd be able to walk through this.

410
00:42:27.740 --> 00:42:28.790
FQ - Natasha Clark: Yeah, I think that's the goal.

411
00:42:28.790 --> 00:42:30.320
FQ Kiera Armintrout: Where is this gonna live?

412
00:42:31.380 --> 00:42:33.519
FQ - Natasha Clark: Data Studio will be in Admin Settings.

413
00:42:34.670 --> 00:42:35.990
FQ Kiera Armintrout: Okay, perfect.

414
00:42:36.480 --> 00:42:37.580
FQ - Natasha Clark: So.

415
00:42:37.900 --> 00:42:38.860
FQ Kiera Armintrout: DZ.

416
00:42:39.160 --> 00:42:42.530
FQ - Natasha Clark: My understanding is that it will be…

417
00:42:42.800 --> 00:42:47.509
FQ - Natasha Clark: Sysadmins and admin, roles that have the access to do this.

418
00:42:49.210 --> 00:42:49.960
FQ Kiera Armintrout: Yeah.

419
00:42:50.320 --> 00:42:51.830
FQ Kiera Armintrout: I think that makes sense.

420
00:42:56.610 --> 00:42:58.530
FQ - Natasha Clark: Any other questions, Crystal?

421
00:42:59.010 --> 00:43:05.930
FQ Kristin Johnson: Nope, I'm all good. Again, Kira, I cannot tell you enough how helpful these sessions are, so thanks for the time.

422
00:43:06.330 --> 00:43:08.160
FQ - Natasha Clark: Yeah, we're… we've learned…

423
00:43:08.160 --> 00:43:13.940
FQ Kiera Armintrout: Yeah, absolutely. Thanks for, challenging my… my critical thinking skills. This is good.

424
00:43:13.940 --> 00:43:14.400
FQ Kristin Johnson: Oh, God.

425
00:43:14.400 --> 00:43:32.800
FQ Kiera Armintrout: to be put in more situations like this. So, yeah, I think this is really great. Thanks for your hard work. I really think this is going to make a big impact in helping our team set up APIs, and encouraging them too, because I know it's a big blocker right now, is the concern about IT resources, and what they need on their end, and…

426
00:43:33.030 --> 00:43:38.289
FQ Kiera Armintrout: it kind of holds up some of the additional modules and things like that, so I think this is going to be a big win.

427
00:43:39.840 --> 00:43:44.190
FQ - Natasha Clark: Yeah, and I mean, if you're… if you're willing, we… we might…

428
00:43:44.370 --> 00:43:56.900
FQ - Natasha Clark: reach out more, over the coming months as we continue to work on other pieces of Data Studio. So, like, this is just one relatively small piece of the whole Data Studio experience.

429
00:43:56.900 --> 00:44:07.500
FQ - Natasha Clark: And, like, the general, just, like, data setup experience, right? So, there are other pieces that we're continuing to work our way through, that we'll want to do.

430
00:44:08.500 --> 00:44:11.330
FQ - Natasha Clark: User testing, on.

431
00:44:11.330 --> 00:44:13.220
FQ Kiera Armintrout: Yeah, absolutely, let me know.

432
00:44:15.360 --> 00:44:16.000
FQ - Natasha Clark: Cool.

433
00:44:17.860 --> 00:44:18.420
FQ Kristin Johnson: Great.

434
00:44:18.780 --> 00:44:21.069
FQ Kiera Armintrout: Well, thank you guys so much! I hope you have a great.

435
00:44:21.070 --> 00:44:21.630
FQ - Natasha Clark: Thank you.

436
00:44:22.210 --> 00:44:22.970
FQ Kristin Johnson: Have a great weekend.

437
00:44:22.970 --> 00:44:24.760
FQ Kiera Armintrout: for your work on this.

438
00:44:25.300 --> 00:44:25.620
FQ Kristin Johnson: Bye.

439
00:44:25.620 --> 00:44:26.250
FQ Kiera Armintrout: I think.

440
00:44:26.250 --> 00:44:26.670
FQ - Natasha Clark: Bye.

441
00:44:26.670 --> 00:44:27.200
FQ Kiera Armintrout: Nope.

