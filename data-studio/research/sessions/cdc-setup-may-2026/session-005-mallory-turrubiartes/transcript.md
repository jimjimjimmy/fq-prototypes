# Session 005 — CDC Connection Flow — Mallory Turrubiartes
Date: 2026-05-15
Participant: Mallory Turrubiartes (ATC II)
Study: Connector Setup — CDC Connection Flow
Task: Using the provided prototype, walk through setting up a NetSuite data connection in Data Studio as if you were a customer configuring it for the first time.

---

WEBVTT

1
00:00:28.740 --> 00:00:31.020
FQ Kristin Johnson: Hello. Hi, Mallory.

2
00:00:31.020 --> 00:00:32.229
FQ Mallory Turrubiartes: Hello!

3
00:00:32.460 --> 00:00:34.440
FQ Kristin Johnson: Thank you for joining us.

4
00:00:36.690 --> 00:00:37.490
FQ - Natasha Clark: Hello.

5
00:00:37.960 --> 00:00:38.550
FQ Mallory Turrubiartes: Hi.

6
00:00:38.960 --> 00:00:40.859
FQ Kristin Johnson: I gather my thoughts, it's been a morning.

7
00:00:41.730 --> 00:00:42.600
FQ Mallory Turrubiartes: All good.

8
00:00:42.600 --> 00:00:51.430
FQ Kristin Johnson: So, one, Natasha and I are both designers on the Data Studio project. Have you heard anything about the Data Studio work that's going on?

9
00:00:51.430 --> 00:00:56.890
FQ Mallory Turrubiartes: A little bit, yeah. I haven't, like, actually seen anything yet, but I have heard… heard something. Okay.

10
00:00:57.040 --> 00:01:06.879
FQ Kristin Johnson: Fantastic. So what we're doing right now is we're working with the product managers, on the project. Alex is one of them. Hello, Alex. And then Rebecca's not able to join.

11
00:01:06.970 --> 00:01:20.829
FQ Kristin Johnson: So does that… Natasha and I have been doing the design part of it, and part of our design goal, right, we understand that not only will folks in your group be using this interface, but eventually, ideally, right, we're doing that self-service handoff to end customers.

12
00:01:20.830 --> 00:01:27.689
FQ Kristin Johnson: And we realized that those customers kind of run the… run the gamut in terms of their knowledge and awareness and their skills and all of that.

13
00:01:27.690 --> 00:01:40.580
FQ Kristin Johnson: So, one of the things that we've been doing is we've been having folks on your team go ahead and look at the designs that we're considering to give us that feedback, not only from your perspective, like, I don't get this, this is confusing, but also really taking that customer lens and looking at.

14
00:01:40.580 --> 00:01:41.340
FQ Mallory Turrubiartes: I'm like…

15
00:01:41.340 --> 00:01:52.700
FQ Kristin Johnson: customers would really find, like, we need to do something different here. So what we're wanting you to do today is actually walk through a design flow with us.

16
00:01:52.900 --> 00:02:10.659
FQ Kristin Johnson: You're really a stand-in, not only for the customer, but also helping us, like, test the design. So, you're kind of a proxy, and… and by that, what we mean is, like, there's nothing that you can tell us that's going to hurt our feelings about the design. Candid feedback is really important, because this is the whole point of having this conversation.

17
00:02:10.660 --> 00:02:30.709
FQ Kristin Johnson: What's also very helpful is as we're going through, just kind of doing that think aloud of, like, okay, so I'm looking at this, and, like, the first thing that comes to my mind is, I don't, like, I don't understand this button, or why is this here, or how would I, how would I find something out? So the more… the more that you can speak to your thinking really helps us kind of get inside, like, how you're processing the design.

18
00:02:30.710 --> 00:02:36.289
FQ Kristin Johnson: When you come up against stuff that's confusing, we're kinda… we're gonna let you struggle.

19
00:02:36.290 --> 00:02:44.570
FQ Kristin Johnson: And I apologize for putting you on the spot, but the point of the struggle is for us to figure out what you're trying to figure out so we can solve the problem, right?

20
00:02:44.570 --> 00:02:45.070
FQ Mallory Turrubiartes: Okay.

21
00:02:45.250 --> 00:02:51.659
FQ Kristin Johnson: So I know it's not fun with an audience, but that's, like, we're not… we're not judging you, we're judging the… you're just helping us, like, push on it.

22
00:02:51.660 --> 00:02:52.340
FQ Mallory Turrubiartes: Okay.

23
00:02:52.340 --> 00:03:04.590
FQ Kristin Johnson: So that's all the setup. One thing for you, we are recording the session, are you okay with us recording? Because again, we're just, like, taking all that insight and figuring out, these are the things she pointed out, this is what we need to fix.

24
00:03:04.890 --> 00:03:05.550
FQ Mallory Turrubiartes: Yep.

25
00:03:05.550 --> 00:03:06.090
FQ Kristin Johnson: Okay.

26
00:03:06.090 --> 00:03:07.140
FQ Mallory Turrubiartes: That's fine, yeah.

27
00:03:07.350 --> 00:03:10.650
FQ Kristin Johnson: Alex or Natasha, anything before we jump in?

28
00:03:13.340 --> 00:03:15.130
FQ - Natasha Clark: No.

29
00:03:15.130 --> 00:03:16.130
FQ Alex Kearns: Go ahead.

30
00:03:16.470 --> 00:03:17.850
FQ - Natasha Clark: No, you go ahead, Alex.

31
00:03:18.980 --> 00:03:21.190
FQ Alex Kearns: Yeah, I was just gonna say, yeah, just really…

32
00:03:21.580 --> 00:03:24.730
FQ Alex Kearns: you, doing this for us. I think…

33
00:03:25.140 --> 00:03:33.090
FQ Alex Kearns: This is such an important way for us to be able to, like, create a better experience for our customers, so just really appreciate it.

34
00:03:33.090 --> 00:03:34.449
FQ Mallory Turrubiartes: Yeah, of course.

35
00:03:34.930 --> 00:03:40.980
FQ Kristin Johnson: So what I will do, Mallory, is I'm going to… I'm going to share my screen, and then I'm actually going to give you control of my screen.

36
00:03:40.980 --> 00:03:41.600
FQ Mallory Turrubiartes: Okay.

37
00:03:41.600 --> 00:03:56.600
FQ Kristin Johnson: And I… what you're gonna see, depending on… on the different folks we've talked to, some have had, like, a very high fidelity, feels like… feels like real HTML, like, you could interact with all the fields. This one, not so much, it's much more just, like, a PowerPoint slide deck, right?

38
00:03:56.600 --> 00:03:57.300
FQ Mallory Turrubiartes: Okay.

39
00:03:57.300 --> 00:04:02.880
FQ Kristin Johnson: There are specific actions you can take, so we'll watch to see if you can find those actions.

40
00:04:03.180 --> 00:04:09.710
FQ Kristin Johnson: You know, if you have questions about something, what I will say is that because of… I'm presenting on my laptop screen.

41
00:04:10.130 --> 00:04:14.439
FQ Kristin Johnson: Some of the controls may be down below the screen, so you may have to scroll a little bit to find them.

42
00:04:14.440 --> 00:04:14.780
FQ Mallory Turrubiartes: Okay.

43
00:04:14.780 --> 00:04:18.029
FQ Kristin Johnson: For that, like, the final presentation would not be that like that.

44
00:04:18.220 --> 00:04:19.060
FQ Mallory Turrubiartes: Okay.

45
00:04:19.060 --> 00:04:28.160
FQ Kristin Johnson: Alright, so I got my screen up, let me do… that… I'm gonna share, and then…

46
00:04:29.360 --> 00:04:33.850
FQ Kristin Johnson: Move this up here… That's right…

47
00:04:38.560 --> 00:04:42.350
FQ Kristin Johnson: And… alright, Mallory, you now have control.

48
00:04:42.350 --> 00:04:43.430
FQ Mallory Turrubiartes: Okay.

49
00:04:44.190 --> 00:04:46.450
FQ Mallory Turrubiartes: Alright, let's see, is it… okay.

50
00:04:47.650 --> 00:04:48.999
FQ Mallory Turrubiartes: There we go, okay.

51
00:04:49.000 --> 00:05:03.269
FQ Kristin Johnson: And so, just to, just to set some context for you here, we need you to set up a certain type of connector. We'll kind of, we'll give you some basic information as you, as you go through.

52
00:05:03.350 --> 00:05:13.309
FQ Kristin Johnson: But the context is you would be coming in with the intent of, like, this is this type of connector I need to set up, now how do I figure out how to, like… what do I need to go through to actually complete that connection process?

53
00:05:13.620 --> 00:05:14.380
FQ Mallory Turrubiartes: Okay.

54
00:05:15.870 --> 00:05:16.910
FQ Mallory Turrubiartes: So, Natasha, you'.

55
00:05:16.910 --> 00:05:17.640
FQ Kristin Johnson: permanent.

56
00:05:19.090 --> 00:05:19.980
FQ Mallory Turrubiartes: Yeah, okay.

57
00:05:19.980 --> 00:05:38.770
FQ - Natasha Clark: Yeah, so, Mallory, this first part is, as you might be able to tell, this is about selecting the connector type. And so, while you're looking at this, would love for you to, I think, as Kristen mentioned before, just, like, talk out loud about, like.

58
00:05:38.780 --> 00:05:41.499
FQ - Natasha Clark: When you click something, why you made that choice.

59
00:05:41.550 --> 00:05:50.729
FQ - Natasha Clark: If you feel like you're missing any information to be able to make the next choice, definitely let us know. But otherwise…

60
00:05:52.480 --> 00:05:54.870
FQ Kristin Johnson: And you're looking for NetSuite, can I?

61
00:05:55.300 --> 00:05:55.860
FQ - Natasha Clark: That's really good.

62
00:05:55.860 --> 00:05:59.980
FQ Mallory Turrubiartes: That's what I was gonna ask, is there a, okay, so…

63
00:06:00.380 --> 00:06:03.750
FQ Mallory Turrubiartes: just to, like, talk out loud, first point of feedback, I think.

64
00:06:03.900 --> 00:06:23.780
FQ Mallory Turrubiartes: the pre-built versus custom titles can be a little bit, maybe, misleading. So, like, for example, on the setup side, we go with, like, a direct integration versus a… like, I mean, custom, potentially, I think. I think the pre-built versus the custom could be misleading for a customer that maybe doesn't have

65
00:06:23.820 --> 00:06:32.389
FQ Mallory Turrubiartes: one of these specific direct integrations, because obviously the default… yeah, I would love to go with pre-built, I don't have to go through as much work, so I think…

66
00:06:32.600 --> 00:06:38.359
FQ Mallory Turrubiartes: making it more specific to say, like, okay, these are direct integrations that we have with Flowcast.

67
00:06:38.870 --> 00:06:46.639
FQ Mallory Turrubiartes: or if your ERP isn't listed here, kind of like something more along the lines so that it's clearer. So that's just kind of my initial…

68
00:06:46.740 --> 00:06:48.250
FQ Mallory Turrubiartes: Thoughts, but we'll go here.

69
00:06:48.250 --> 00:06:53.940
FQ - Natasha Clark: So the word integration is more recognizable for customers. I think so.

70
00:06:53.940 --> 00:07:06.590
FQ Mallory Turrubiartes: Yeah, and then from, like, a… and I don't know for sure from a sales side, but definitely on, like, the setup side, like, when we're going through our kickoff calls and stuff, like, that's something that we will say is, like, okay, well, we do have a direct integration with this, or we don't.

71
00:07:06.600 --> 00:07:17.059
FQ Mallory Turrubiartes: Or if, like, clients ask about specific functionality, because maybe they were doing some research and saw, like, oh, Flowcast does XYZ within this specific module, we kind of use that to say, oh, well.

72
00:07:17.060 --> 00:07:28.400
FQ Mallory Turrubiartes: you know, for certain ERPs, we have, like, a direct integration, and so it's a little bit more of an advanced connection, versus, you know, with your ERP, because we're connected via SFTP API, whatever.

73
00:07:28.550 --> 00:07:33.460
FQ Mallory Turrubiartes: it's just not as advanced of a connection. So I think just something a little bit more…

74
00:07:33.910 --> 00:07:38.710
FQ Mallory Turrubiartes: Specific to say, yes, you can do this, or no, you can't, versus, like.

75
00:07:39.260 --> 00:07:46.969
FQ Mallory Turrubiartes: do you want to start with something that we've already created, or, you know, do you want to create your own? Like, kind of, like, making it clear, yes, you can do this, or no, you can't.

76
00:07:49.440 --> 00:07:52.440
FQ Mallory Turrubiartes: Okay, so we're going with NetSuite.

77
00:07:54.120 --> 00:07:55.060
FQ Mallory Turrubiartes: Okay.

78
00:07:57.940 --> 00:08:00.950
FQ Mallory Turrubiartes: Translation Standards.

79
00:08:02.490 --> 00:08:07.850
FQ Mallory Turrubiartes: Okay, I'm gonna go with enhanced, because it sounds more fun.

80
00:08:07.850 --> 00:08:10.490
FQ - Natasha Clark: Sounds like a different rate on that.

81
00:08:10.490 --> 00:08:19.080
FQ Mallory Turrubiartes: Well, meaning it sounds like it can just do more things, so, like, basic, I guess, you know, depends on what the client is really wanting to do,

82
00:08:19.600 --> 00:08:25.860
FQ Mallory Turrubiartes: But… also, I guess, depending on what they have in their contract. So, some clients may…

83
00:08:26.070 --> 00:08:28.589
FQ Mallory Turrubiartes: Not have any added modules, so then in that.

84
00:08:28.770 --> 00:08:32.130
FQ Mallory Turrubiartes: case, yes, probably they would go with a basic connection.

85
00:08:32.230 --> 00:08:35.650
FQ Mallory Turrubiartes: enhanced, I think, would be helpful for, like.

86
00:08:36.230 --> 00:08:43.180
FQ Mallory Turrubiartes: if you are doing AI matching, or variance analysis, or any of the things where, like, the transactional data

87
00:08:43.470 --> 00:08:47.070
FQ Mallory Turrubiartes: will be utilized versus RECS isn't always.

88
00:08:47.700 --> 00:08:52.869
FQ Mallory Turrubiartes: You know, the reconciliations, you don't necessarily need that level of detail to come in.

89
00:08:54.490 --> 00:08:57.519
FQ Kristin Johnson: How well do you think a customer would be able to make this distinction?

90
00:08:58.460 --> 00:09:00.179
FQ Mallory Turrubiartes: That's a good point. I think…

91
00:09:02.180 --> 00:09:13.689
FQ Mallory Turrubiartes: I would say most customers, probably by default, would prefer an enhanced connection, because again, it's kind of, like, on the same note of, like, oh yeah, I want to get the most value out of Flowcast, so this just…

92
00:09:14.080 --> 00:09:19.020
FQ Mallory Turrubiartes: Sounds like you can do more with it, versus this is very, like.

93
00:09:19.570 --> 00:09:37.360
FQ Mallory Turrubiartes: Okay, yeah, that's all I need. Almost, like, this kind of gives me the feel of when you are, like, TurboTax is the only one I'm thinking of, but, like, where something is, like, free, almost, so you get, like, the base level, and then, like, you could pay for more, like, if you want, or if you have, like, a more complex tax return, or something along those lines.

94
00:09:37.700 --> 00:09:41.269
FQ Mallory Turrubiartes: So, I feel like, again, it would be helpful

95
00:09:42.050 --> 00:09:47.050
FQ Mallory Turrubiartes: I don't know if this is something potentially that could be done, but, like, to the point of…

96
00:09:47.280 --> 00:09:52.379
FQ Mallory Turrubiartes: Depending on what package, quote-unquote, a client has, like.

97
00:09:53.960 --> 00:10:05.650
FQ Mallory Turrubiartes: would it be worth it to do the enhanced connection or not? I think it kind of depends on, like, where it goes after this, because I'm, you know, coming into this kind of blind, but, like, I don't think it necessarily would hurt for…

98
00:10:05.970 --> 00:10:12.889
FQ Mallory Turrubiartes: Anyone to do this, even if they're not using it at the moment, because then the connection's already established, and if they add

99
00:10:13.130 --> 00:10:18.409
FQ Mallory Turrubiartes: Other added modules down the line into their contract, like, they wouldn't necessarily have to do any additional steps.

100
00:10:18.570 --> 00:10:21.369
FQ Mallory Turrubiartes: But I think that could also come from, like.

101
00:10:22.090 --> 00:10:32.880
FQ Mallory Turrubiartes: obviously an ATC is going to be doing the setup initially, so they would have that background, and it may just be something that, like, is communicated during enablement or, like, something like that, but I think…

102
00:10:33.970 --> 00:10:37.870
FQ Mallory Turrubiartes: maybe adding… Something to say, like.

103
00:10:38.650 --> 00:10:49.130
FQ Mallory Turrubiartes: Maybe putting in the language, like, the added modules that this would feed, or something, like, where these specific things would kind of come into play throughout the application to know if it's something that they need or not.

104
00:10:51.720 --> 00:10:56.199
FQ Alex Kearns: So, one thing I'm curious about on there,

105
00:10:56.620 --> 00:10:58.860
FQ Alex Kearns: You'll notice on the enhanced, or maybe.

106
00:10:58.860 --> 00:10:59.450
FQ Mallory Turrubiartes: Hmm.

107
00:10:59.450 --> 00:11:01.499
FQ Alex Kearns: Not that it… you require…

108
00:11:01.500 --> 00:11:02.010
FQ Mallory Turrubiartes: Yeah.

109
00:11:02.010 --> 00:11:03.530
FQ Alex Kearns: Suite Analytics Connect.

110
00:11:03.860 --> 00:11:14.330
FQ Alex Kearns: NetSuite, is that gonna be clear to a customer, too? Because just because you have NetSuite, you might not, even if you want, you might not be able to use this.

111
00:11:14.840 --> 00:11:17.779
FQ Mallory Turrubiartes: I would say… I guess let me back up and ask.

112
00:11:18.290 --> 00:11:37.130
FQ Mallory Turrubiartes: when, I guess, realistically, would a client, or would you foresee a client coming through this step? Would this kind of replace the current, like, setup link that we send to them, where they, you know, put in their, credentials for, like, NetSuite, Intact, etc? Like, would this happen at that

113
00:11:37.610 --> 00:11:40.040
FQ Mallory Turrubiartes: Point, or is this something that, like.

114
00:11:40.980 --> 00:11:45.520
FQ Mallory Turrubiartes: an ATC, realistically, would assist them with.

115
00:11:46.000 --> 00:11:50.080
FQ Mallory Turrubiartes: And I ask because within kickoff calls, and I also think it's something that there's…

116
00:11:50.190 --> 00:11:58.240
FQ Mallory Turrubiartes: they're supposed to discuss during a sales cycle, we do ask, like, do you have NetSuite Analytics Connect? Most clients

117
00:11:58.450 --> 00:12:01.309
FQ Mallory Turrubiartes: I say most. A lot of clients say.

118
00:12:01.730 --> 00:12:05.239
FQ Mallory Turrubiartes: yes or no, and they kind of know right off the bat. Some clients…

119
00:12:05.430 --> 00:12:21.060
FQ Mallory Turrubiartes: don't really know what that is. I mean, they know it's probably a package or something of NetSuite, but sometimes we do have to provide clarification, so I think you could almost maybe have, like, one of those little info icons where they could hover over and, I don't know, maybe have, like.

120
00:12:21.910 --> 00:12:27.460
FQ Mallory Turrubiartes: a description of NetSuite Analytics Connect, or… or something along those lines, just so that

121
00:12:27.830 --> 00:12:33.790
FQ Mallory Turrubiartes: If they really just have no idea, you know, they could hover over it and see what it is, but…

122
00:12:34.170 --> 00:12:43.199
FQ Mallory Turrubiartes: I think outside, like, depending on when the client gets brought into this piece, most of the time it should have already been discussed with them to know whether or not they have it.

123
00:12:45.070 --> 00:12:47.880
FQ Alex Kearns: Great, and I think, from our perspective.

124
00:12:49.030 --> 00:12:53.179
FQ Alex Kearns: We would like this state to be without ATC assistance.

125
00:12:53.180 --> 00:12:54.070
FQ Mallory Turrubiartes: Okay,

126
00:12:54.070 --> 00:12:59.880
FQ Alex Kearns: And that's kind of, like, one of our end goals. I…

127
00:13:00.300 --> 00:13:04.200
FQ Alex Kearns: like, Kristen kind of mentioned at the beginning of this, though, like.

128
00:13:04.480 --> 00:13:15.510
FQ Alex Kearns: We're kind of viewing the ATCs as sort of, like, our initial customer base, because you probably will have to help, somewhat, but yeah, we're hoping customers are able to navigate this by themselves.

129
00:13:16.070 --> 00:13:16.750
FQ Mallory Turrubiartes: Okay.

130
00:13:16.940 --> 00:13:32.570
FQ Mallory Turrubiartes: Yeah, I think realistically, like I said, most… before they get to this step, because they are not supposed to fill out most of the setup link before the kickoff call anyways, so I think realistically, the conversation should have already been, you know, had.

131
00:13:32.700 --> 00:13:39.449
FQ Mallory Turrubiartes: But… and then, kind of sidetracking a little bit, if we're thinking that this would replace the setup link.

132
00:13:39.580 --> 00:13:42.219
FQ Mallory Turrubiartes: I think it could be helpful to almost have

133
00:13:43.310 --> 00:13:48.089
FQ Mallory Turrubiartes: these options be dependent on where they're at in their setup cycle. So, like.

134
00:13:48.310 --> 00:13:57.670
FQ Mallory Turrubiartes: realistically, ERP would be first, and then if Trivada or, you know, something else, if there's additional things that get added later, like.

135
00:13:58.280 --> 00:14:00.570
FQ Mallory Turrubiartes: Once we get to the point of…

136
00:14:00.750 --> 00:14:11.809
FQ Mallory Turrubiartes: wanting to do those steps. Like, I think it… whenever they get to this point, it should kind of depend on, like, where they're at in the setup cycle. Like, if it's replacing the setup link, and it's something we send them, like.

137
00:14:12.110 --> 00:14:25.530
FQ Mallory Turrubiartes: initially, to get Flowcast up and running, I think having only the ERPs available at that point would be helpful, and then we could move into, like, Tribata or other, you know, setups outside of the ERP after that.

138
00:14:26.010 --> 00:14:29.059
FQ Kristin Johnson: And so, just so I'm following Mallory, so all you're saying is…

139
00:14:29.680 --> 00:14:41.020
FQ Kristin Johnson: to only show ERPs that are essential for that, like, that initial step, then any supplemental data would occur, or be part of a separate setup process, or whatever.

140
00:14:41.020 --> 00:14:42.270
FQ Mallory Turrubiartes: Yeah.

141
00:14:42.630 --> 00:14:47.090
FQ Kristin Johnson: And so keep in mind, also, this could be something where someone already has an instance up and running, they come

142
00:14:47.670 --> 00:14:49.950
FQ Kristin Johnson: relating, like, we've got Truvada.

143
00:14:49.950 --> 00:15:04.479
FQ Mallory Turrubiartes: Right, yeah. Yeah, so I think absolutely, like, if it's… once the Flowcast connection is live, because to your point, like, clients have multiple ERPs that they're working with, so it may be a later step that, like, we're migrating, or we've acquired XYZ, and they use NetSuite.

144
00:15:04.480 --> 00:15:16.310
FQ Mallory Turrubiartes: So I think at certain points, having all of them is fine, but I think just kind of, like, to call out, like, if it's the initial setup link or, you know, whatever that gets sent out, I think having only the ERPs at that point…

145
00:15:16.400 --> 00:15:19.840
FQ Mallory Turrubiartes: Would be helpful, if it's possible, to separate them.

146
00:15:20.990 --> 00:15:21.800
FQ Mallory Turrubiartes: Okay.

147
00:15:22.070 --> 00:15:23.619
FQ Mallory Turrubiartes: Alright, so I'm going enhanced.

148
00:15:23.870 --> 00:15:25.020
FQ Mallory Turrubiartes: Continue.

149
00:15:26.440 --> 00:15:27.440
FQ Mallory Turrubiartes: Okay.

150
00:15:29.100 --> 00:15:29.970
FQ Mallory Turrubiartes: Okay.

151
00:15:33.520 --> 00:15:35.050
FQ Mallory Turrubiartes: Let me type.

152
00:15:35.480 --> 00:15:37.950
FQ Kristin Johnson: And yeah, you won't be able to click into the fields.

153
00:15:38.490 --> 00:15:39.200
FQ Mallory Turrubiartes: Oh, okay.

154
00:15:39.200 --> 00:15:43.590
FQ Kristin Johnson: But that said, do you… Do you have the information you need?

155
00:15:44.300 --> 00:15:57.260
FQ Mallory Turrubiartes: Yeah, so this, from my standpoint, we have the NetSuite connection guide, or any of the ERP connection guides that they would get, so I think all of that… this looks very similar to what they get now.

156
00:15:57.400 --> 00:15:59.669
FQ Mallory Turrubiartes: So, I think this would be fine.

157
00:15:59.980 --> 00:16:00.829
FQ Kristin Johnson: And do you… That's.

158
00:16:00.830 --> 00:16:02.630
FQ Mallory Turrubiartes: There is… oh, go ahead.

159
00:16:02.630 --> 00:16:09.360
FQ Kristin Johnson: Do you get follow-ups from them now, asking, like, well, how do I get my token, or how do I get my token secret?

160
00:16:09.360 --> 00:16:29.159
FQ Mallory Turrubiartes: Most of the time, no, because the guides that we have today are, like, pretty detailed, and they have, like, the step-by-step, the screenshots directly from NetSuite, so for the most part, no. Obviously, there's going to be a few clients that, like, maybe they don't really have an IT team, and so they're kind of handling, and they're just not, like, a super technical group, but for the most part, no, it's pretty…

161
00:16:29.280 --> 00:16:32.939
FQ Mallory Turrubiartes: Pretty straightforward, like, on how to establish these things.

162
00:16:32.940 --> 00:16:38.239
FQ Kristin Johnson: Do you know how quickly those guides, or how frequently those guides get updated or changed?

163
00:16:39.790 --> 00:16:41.599
FQ Mallory Turrubiartes: I don't know, I know…

164
00:16:42.550 --> 00:16:52.669
FQ Mallory Turrubiartes: I don't… I don't know that they get changed very frequently, because I think… I don't think that the way that these are connected get updated or changed very frequently, so I think it would kind of depend…

165
00:16:52.690 --> 00:17:04.310
FQ Mallory Turrubiartes: on the ERP, and, like, if they're changing their process, you know, then obviously we would update our guys, but I think it would heavily depend on, like, NetSuite or Intact or whoever actually changing, like, their

166
00:17:04.400 --> 00:17:06.629
FQ Mallory Turrubiartes: Own process of getting these.

167
00:17:06.630 --> 00:17:07.699
FQ Kristin Johnson: Got it. Okay.

168
00:17:09.060 --> 00:17:14.610
FQ Mallory Turrubiartes: So this question… so this, I don't think it'll let me click, I don't know if it's.

169
00:17:14.619 --> 00:17:17.149
FQ Kristin Johnson: It would actually… it would be disabled.

170
00:17:17.150 --> 00:17:20.249
FQ Mallory Turrubiartes: Okay, okay, that was gonna be my, my question. Okay.

171
00:17:20.250 --> 00:17:21.790
FQ Kristin Johnson: And what was the question there?

172
00:17:22.079 --> 00:17:24.509
FQ Mallory Turrubiartes: Just, because, like, for…

173
00:17:24.619 --> 00:17:33.489
FQ Mallory Turrubiartes: today, like, talk trucks don't really include, like, a refresh frequency from our direct integrations. The understanding is that it's

174
00:17:33.599 --> 00:17:36.109
FQ Mallory Turrubiartes: For the most part, in real time, obviously, like.

175
00:17:36.269 --> 00:17:43.209
FQ Mallory Turrubiartes: There's maybe a little bit of a delay between when you post a journal entry versus when you could refresh and have that balance populate, but

176
00:17:43.389 --> 00:17:47.929
FQ Mallory Turrubiartes: The assumption would definitely be way more frequent than hourly for direct integrations.

177
00:17:49.610 --> 00:17:52.169
FQ Kristin Johnson: Okay. Alex, do you have anything on that?

178
00:17:55.490 --> 00:18:12.720
FQ Kristin Johnson: Because we're going to… so to my knowledge, at least for the enhanced connection, it will be… it will be every hour, and that's all they'll be able to do with it. So are we talking about… are you looking for, like, an on-demand refresh versus just us checking every hour for that data in terms of customer expectation?

179
00:18:13.270 --> 00:18:17.730
FQ Mallory Turrubiartes: Well, I guess that's a good point. So, when I say, like, more…

180
00:18:18.010 --> 00:18:24.929
FQ Mallory Turrubiartes: real time, it would be, like, the balance data. I guess not necessarily as much the transactional data.

181
00:18:25.270 --> 00:18:37.770
FQ Mallory Turrubiartes: But I do know for, at least today, from my understanding, the direct integrations are much more real-time than hourly, because the SFTP, at most, we can receive that data

182
00:18:37.800 --> 00:18:47.869
FQ Mallory Turrubiartes: hourly on the Flowcast side, or at least that's what we recommend, like, no more than hourly, which is kind of, like, one of the cons of an SFTP approach versus, like, the direct integration.

183
00:18:49.130 --> 00:18:54.460
FQ Alex Kearns: Yeah, from the… so this is, going through our Fivetran connection.

184
00:18:54.460 --> 00:18:54.890
FQ Mallory Turrubiartes: Okay.

185
00:18:54.890 --> 00:19:04.780
FQ Alex Kearns: And what, we've talked about with the engineering team is that we only get that data, or that we only pull that in every hour.

186
00:19:04.780 --> 00:19:09.450
FQ Mallory Turrubiartes: Okay, and that just may be a misunderstanding from me. But…

187
00:19:09.620 --> 00:19:17.050
FQ Mallory Turrubiartes: Okay, but this would be disabled on, like, the advanced connection, or the… yeah, the, like, enhanced, or the…

188
00:19:17.190 --> 00:19:19.939
FQ Mallory Turrubiartes: direct integration type of connections. Okay.

189
00:19:20.730 --> 00:19:21.590
FQ Mallory Turrubiartes: Okay.

190
00:19:21.590 --> 00:19:24.400
FQ Kristin Johnson: And your, yeah, your buttons may be down, down below, there you go.

191
00:19:24.400 --> 00:19:30.330
FQ Mallory Turrubiartes: There we go, okay. Will it let me do it without the… let's see… Oh, cool, okay.

192
00:19:30.330 --> 00:19:35.119
FQ Kristin Johnson: I'm sorry that… The prototype is goofy.

193
00:19:35.120 --> 00:19:35.710
FQ Mallory Turrubiartes: Okay.

194
00:19:35.710 --> 00:19:37.919
FQ Kristin Johnson: If I can get here, I'm gonna take over.

195
00:19:38.390 --> 00:19:41.939
FQ Kristin Johnson: Control, you're gonna see all the, all the things behind the curtain here.

196
00:19:41.940 --> 00:19:42.870
FQ Mallory Turrubiartes: That's okay.

197
00:19:43.430 --> 00:19:45.670
FQ Mallory Turrubiartes: because my eyes pretend I didn't.

198
00:19:49.830 --> 00:19:52.620
FQ Kristin Johnson: See if we can get a fill on this, if that'll fix it.

199
00:19:54.010 --> 00:19:56.489
FQ Kristin Johnson: Alright, let's go back here, there we go.

200
00:19:56.860 --> 00:19:58.290
FQ Mallory Turrubiartes: Oh, there we go, okay.

201
00:19:58.640 --> 00:20:00.390
FQ Mallory Turrubiartes: Authenticated!

202
00:20:06.500 --> 00:20:07.440
FQ Mallory Turrubiartes: Okay.

203
00:20:08.190 --> 00:20:10.190
FQ Mallory Turrubiartes: I think that makes sense.

204
00:20:11.200 --> 00:20:13.500
FQ Mallory Turrubiartes: Okay.

205
00:20:13.500 --> 00:20:14.230
FQ Kristin Johnson: with me.

206
00:20:15.810 --> 00:20:31.519
FQ Mallory Turrubiartes: This, that basically they are still in the process of, like, establishing the connection, like, the credentials or whatever that they've put in were accepted and are, like, active, but that the actual data is not quite ready yet, because it's going to take it a while to basically, like.

207
00:20:31.970 --> 00:20:34.869
FQ Mallory Turrubiartes: be pulled in or synced with Flowcast.

208
00:20:35.080 --> 00:20:35.760
FQ Kristin Johnson: Okay.

209
00:20:35.760 --> 00:20:36.940
FQ Mallory Turrubiartes: Interesting. Okay.

210
00:20:37.750 --> 00:20:39.750
FQ Mallory Turrubiartes: Okay.

211
00:20:39.890 --> 00:20:42.420
FQ Mallory Turrubiartes: I don't know if I need to scroll…

212
00:20:42.420 --> 00:20:43.969
FQ Kristin Johnson: Yeah, you'll need to go down.

213
00:20:43.970 --> 00:20:45.100
FQ Mallory Turrubiartes: Oh, there we go.

214
00:20:45.640 --> 00:20:46.999
FQ Mallory Turrubiartes: There we go, okay.

215
00:20:50.770 --> 00:20:55.010
FQ Mallory Turrubiartes: Okay… Oh, sorry.

216
00:20:55.010 --> 00:20:58.990
FQ Kristin Johnson: I should say Mallory, not Jake. Jake, possibly walk through with us.

217
00:20:58.990 --> 00:21:00.140
FQ Mallory Turrubiartes: That's okay.

218
00:21:00.880 --> 00:21:04.570
FQ Mallory Turrubiartes: Okay, so then… Miss…

219
00:21:04.750 --> 00:21:13.849
FQ Mallory Turrubiartes: It would seem like is not available yet because of the screen that we just looked at that said it takes it some time to sync, is that right?

220
00:21:14.140 --> 00:21:16.030
FQ Kristin Johnson: Yeah, what makes you think that?

221
00:21:16.500 --> 00:21:19.360
FQ Mallory Turrubiartes: Because the edit, it's… well, it says in process.

222
00:21:19.590 --> 00:21:23.299
FQ Mallory Turrubiartes: And then it won't let me edit or do anything with the tables.

223
00:21:23.300 --> 00:21:24.190
FQ Kristin Johnson: Okay.

224
00:21:24.420 --> 00:21:25.100
FQ Mallory Turrubiartes: Okay.

225
00:21:25.730 --> 00:21:31.510
FQ Mallory Turrubiartes: Okay, save and set active.

226
00:21:31.510 --> 00:21:35.520
FQ Kristin Johnson: And really quickly, can you go and hit the back button in the browser?

227
00:21:37.670 --> 00:21:40.319
FQ Kristin Johnson: Why did you choose Save and Set Active?

228
00:21:41.860 --> 00:21:53.820
FQ Mallory Turrubiartes: mostly just for the sake of this, to, like, move to the next step, but I guess, realistically, a client would probably, if they haven't been able to do this piece, would hit save as draft.

229
00:21:54.280 --> 00:21:57.740
FQ Mallory Turrubiartes: But I guess… on that, I kind of…

230
00:21:58.720 --> 00:22:01.329
FQ Mallory Turrubiartes: I guess it's unclear a little bit what this…

231
00:22:01.430 --> 00:22:05.919
FQ Mallory Turrubiartes: Steph would do? Like, what specifically the tables are?

232
00:22:06.220 --> 00:22:12.810
FQ Mallory Turrubiartes: That they would be… editing or, like, what this actually is, I guess.

233
00:22:14.210 --> 00:22:23.320
FQ Kristin Johnson: Okay, so this… for the select table step, so we know, we know based on the messaging on the previous step that… that it's loading, right?

234
00:22:25.450 --> 00:22:28.589
FQ Kristin Johnson: What visibility do you think they're gonna want?

235
00:22:33.560 --> 00:22:39.470
FQ Mallory Turrubiartes: Are you… are you meaning, like, visibility in the terms of, like, where this is at, or how much longer this has?

236
00:22:39.470 --> 00:22:51.559
FQ Kristin Johnson: Well, yeah, and you had made a comment on something around, and everyone jump out in, if you remember specifically, but it sounded like you had a comment around wanting to see their data, or wanting to understand their tables, or something like that.

237
00:22:51.560 --> 00:22:59.530
FQ Mallory Turrubiartes: Oh, yeah, yeah, I think… Maybe not viewing the entire data, but having a Maybe, like, a…

238
00:23:00.790 --> 00:23:03.650
FQ Mallory Turrubiartes: Some details or information around, like.

239
00:23:04.790 --> 00:23:07.639
FQ Mallory Turrubiartes: What even are the tab… like.

240
00:23:08.160 --> 00:23:12.939
FQ Mallory Turrubiartes: like, what specifically are the tables that we're looking at? Like,

241
00:23:13.380 --> 00:23:19.209
FQ Mallory Turrubiartes: I guess let me think of a better way to explain it. Like, I guess to me, I just don't really know what

242
00:23:20.080 --> 00:23:24.659
FQ Mallory Turrubiartes: this is even, like, what I would even be editing here, if that makes sense.

243
00:23:24.660 --> 00:23:27.590
FQ Kristin Johnson: Yeah, for sure. Can you hit the browser back button again?

244
00:23:27.590 --> 00:23:28.190
FQ Mallory Turrubiartes: Yep.

245
00:23:29.090 --> 00:23:39.430
FQ Kristin Johnson: So… and this page layout is goofy, so I apologize for that. But in the left sidebar, there are some… there are some items.

246
00:23:39.770 --> 00:23:40.540
FQ Mallory Turrubiartes: Okay.

247
00:23:40.770 --> 00:23:41.550
FQ Mallory Turrubiartes: Okay.

248
00:23:41.940 --> 00:23:44.339
FQ Kristin Johnson: But, but, you didn't see those at first.

249
00:23:44.480 --> 00:23:44.910
FQ Mallory Turrubiartes: I did.

250
00:23:44.910 --> 00:23:48.149
FQ Kristin Johnson: Again, it could be the goofy, bad layout in the content area.

251
00:23:48.150 --> 00:23:56.010
FQ Mallory Turrubiartes: So I think what I would say then is pull this… Also into the second screen.

252
00:23:56.310 --> 00:23:56.730
FQ Kristin Johnson: Okay.

253
00:23:56.730 --> 00:24:17.909
FQ Mallory Turrubiartes: to where, like, you see, if, you know, they may be more attention to detail than I, and so they may notice this, but in the event that they don't, because they're focused on reading this messaging, maybe keep it here, but also pull this onto, like, that next screen. But I would even go not necessarily having it as, like, an additional left

254
00:24:17.910 --> 00:24:20.410
FQ Mallory Turrubiartes: like, navigation, I would put it…

255
00:24:21.010 --> 00:24:28.250
FQ Mallory Turrubiartes: Somewhere within this little section to where you could see, like, okay, these are my three tables that we're looking at.

256
00:24:28.830 --> 00:24:43.260
FQ Mallory Turrubiartes: and I also, again, I don't know if this would even work or not, because depending on how it's loading and, like, how it's pulling in, but potentially having, like, if it's possible to edit one before the remaining two are available, like, if you could edit them

257
00:24:43.950 --> 00:24:50.930
FQ Mallory Turrubiartes: as the sync is done, having, like, an edit button per table, even, could be helpful.

258
00:24:51.160 --> 00:24:53.600
FQ Mallory Turrubiartes: I think just to kind of, like, clarify.

259
00:24:54.190 --> 00:25:10.169
FQ Mallory Turrubiartes: what are the tables we're looking at? And then, okay, well, these two are done, let me start with these, and then hopefully by the time I finish those two, or, you know, whatever, the last one will be done, but they can just see, like, where the progress is at, and know exactly what they would be looking at if they clicked into that.

260
00:25:10.360 --> 00:25:17.199
FQ Kristin Johnson: Okay, perfect, very helpful. And then going back to the save as draft versus save instead active still…

261
00:25:17.520 --> 00:25:21.300
FQ Kristin Johnson: Like, do you know what's gonna happen with each of those button choices?

262
00:25:23.720 --> 00:25:29.020
FQ Mallory Turrubiartes: Well, save as draft, I think, would mean that it's not a live…

263
00:25:29.810 --> 00:25:33.730
FQ Mallory Turrubiartes: And, like, usable connection just yet, meaning, like.

264
00:25:34.760 --> 00:25:43.050
FQ Mallory Turrubiartes: flow… like, flow cap… like, I couldn't go and set a reconciliation up from that connection, would be my thought, if it was save as draft.

265
00:25:43.050 --> 00:26:00.040
FQ Mallory Turrubiartes: Versus save and set active, to me, would mean, okay, now this is live, and so I can go in and start setting up my RECs, or, you know, depending on where I'm at in the process, like, adding in my recs, or, you know, connecting and building variance reports, or whatever, like, Flowcast now is live.

266
00:26:00.140 --> 00:26:01.700
FQ Mallory Turrubiartes: And I can start doing that.

267
00:26:01.960 --> 00:26:12.170
FQ Mallory Turrubiartes: And then save as draft is like, okay, I can come back in, finish doing whatever I need to do, and then once I've finished all my edits, now I can go in and work in Flowcast.

268
00:26:12.470 --> 00:26:19.130
FQ Kristin Johnson: I'm kind of going back to the point of the previous screen we were looking at with respect to, like, okay, it may take a little while to bring the tables in.

269
00:26:19.460 --> 00:26:26.269
FQ Kristin Johnson: what it… when you were describing what you expected to happen with save and said active is that you saved, you said active, you go right over to your REX, and you start to.

270
00:26:26.270 --> 00:26:27.530
FQ Mallory Turrubiartes: See your tweet.

271
00:26:27.530 --> 00:26:31.939
FQ Kristin Johnson: is if you click that button, you're going to be able to go over and do that, that setup.

272
00:26:32.140 --> 00:26:33.590
FQ Kristin Johnson: with that data.

273
00:26:35.310 --> 00:26:37.090
FQ Mallory Turrubiartes: I think… I would think so, yeah.

274
00:26:37.270 --> 00:26:37.980
FQ Kristin Johnson: Okay.

275
00:26:38.160 --> 00:26:38.730
FQ Mallory Turrubiartes: So I think…

276
00:26:38.730 --> 00:26:42.239
FQ Kristin Johnson: There is a load time, and so that's part of the gap that we're trying to bridge, is like…

277
00:26:42.240 --> 00:26:42.680
FQ Mallory Turrubiartes: Bye.

278
00:26:42.680 --> 00:26:48.950
FQ Kristin Johnson: They are setting it active, so when the data is loaded and available, we will stream it into Flowcast, but it could be…

279
00:26:48.950 --> 00:26:54.540
FQ Mallory Turrubiartes: So then, I think potentially what could be helpful is you almost disable this button until…

280
00:26:55.150 --> 00:27:00.880
FQ Mallory Turrubiartes: all of the… like, until this… the way that this is disabled, you would do something similar with save and set active.

281
00:27:01.710 --> 00:27:03.820
FQ Kristin Johnson: Why would we make them come back, though?

282
00:27:06.380 --> 00:27:09.590
FQ Mallory Turrubiartes: I f- well… I guess you wouldn't…

283
00:27:09.740 --> 00:27:12.709
FQ Mallory Turrubiartes: Yeah, I guess that's a good point, but my thought would be…

284
00:27:13.620 --> 00:27:28.319
FQ Mallory Turrubiartes: that I think we would probably get a couple of emails of, like, hey, I did save and set active, but, like, I'm not able to access anything, which, yeah, we could, you know, respond with, oh, have you received notification that, like, the data load has completed, or whatever, but I think…

285
00:27:29.180 --> 00:27:39.699
FQ Mallory Turrubiartes: to potentially avoid that panic of, like, oh, hey, I got, like, all these successful messages, like, it said my connection was good to go, like, I hit, like, it's done, but, like, I still can't access anything.

286
00:27:40.240 --> 00:27:43.310
FQ Mallory Turrubiartes: I think that could be… Thank you.

287
00:27:43.510 --> 00:27:52.339
FQ Kristin Johnson: What if we had something where maybe right in this review area, right, there were… there were two options or two buttons, which is like, keep this in draft state.

288
00:27:52.710 --> 00:27:55.999
FQ Kristin Johnson: You know, I don't want my data flowing into NetSuite or whatever, like, whatever.

289
00:27:56.000 --> 00:27:56.479
FQ Mallory Turrubiartes: We're in a contract.

290
00:27:56.480 --> 00:27:57.140
FQ Kristin Johnson: Right?

291
00:27:57.580 --> 00:28:02.489
FQ Kristin Johnson: Until I can… until I can come back and customize once the load is done, or…

292
00:28:02.930 --> 00:28:08.539
FQ Kristin Johnson: no, bring all data, like, I'm ready for data in Flowcache once it's loaded, so they make.

293
00:28:08.540 --> 00:28:08.950
FQ Mallory Turrubiartes: Yeah.

294
00:28:08.950 --> 00:28:12.300
FQ Kristin Johnson: It's there, and then that button is actually finish.

295
00:28:12.640 --> 00:28:16.039
FQ Mallory Turrubiartes: Yeah, almost like you could have, like, if you click…

296
00:28:16.250 --> 00:28:25.440
FQ Mallory Turrubiartes: this button, you could have a pop-up that appears next that says, like, like, success, whatever, you've established your connection.

297
00:28:25.690 --> 00:28:31.949
FQ Mallory Turrubiartes: once the data finishes loading, you'll be able to access that within Flowcast. Like, some kind of little blurb that almost…

298
00:28:32.410 --> 00:28:39.169
FQ Mallory Turrubiartes: Clarifies to them, okay, this is a live connection, so once your data is ready, like, puts that kind of piece of…

299
00:28:39.480 --> 00:28:45.079
FQ Mallory Turrubiartes: It may not be ready yet, so once it's ready, you'll be able to come in and access that within Flowcast.

300
00:28:45.080 --> 00:28:45.760
FQ Kristin Johnson: Okay.

301
00:28:45.890 --> 00:28:47.120
FQ Kristin Johnson: Super helpful.

302
00:28:47.120 --> 00:28:47.810
FQ Mallory Turrubiartes: Okay.

303
00:28:48.080 --> 00:28:50.500
FQ Mallory Turrubiartes: Another question I have, kind of on that.

304
00:28:51.130 --> 00:28:55.409
FQ Mallory Turrubiartes: This step, if we go save and set active.

305
00:28:55.520 --> 00:28:57.810
FQ Mallory Turrubiartes: Are they able to come back

306
00:28:57.970 --> 00:29:04.129
FQ Mallory Turrubiartes: And edit these tables, or once you hit save and set active, is that kind of, like, set in stone, and now…

307
00:29:04.340 --> 00:29:08.950
FQ Mallory Turrubiartes: If there were edits that needed to be made to these tables, you kind of are unable to do so.

308
00:29:09.440 --> 00:29:12.280
FQ Kristin Johnson: What would make you feel more confident that the answer is yes?

309
00:29:13.910 --> 00:29:19.650
FQ Mallory Turrubiartes: just… honestly, just overall how Flowcast operates in general, like, I feel like that's a very…

310
00:29:19.910 --> 00:29:22.249
FQ Mallory Turrubiartes: Flowcast type of function of, like.

311
00:29:23.160 --> 00:29:30.630
FQ Mallory Turrubiartes: nothing is ever set in stone, to some extent. I mean, obviously some things are, but, like, for the most part, with Flowcast, like, nothing is really ever…

312
00:29:30.770 --> 00:29:33.699
FQ Mallory Turrubiartes: extremely permanent, for the most part.

313
00:29:34.370 --> 00:29:41.459
FQ Mallory Turrubiartes: So, as, like, a very knowledgeable Flowcast person, I think that would kind of… I would understand that.

314
00:29:42.200 --> 00:29:54.630
FQ Kristin Johnson: In terms of what we're looking at, is there something you can think of that we could… we could do to help communicate that to customers, or reassure them that, yes, you… you will be able to, like… and it will be available soon?

315
00:29:55.280 --> 00:29:56.260
FQ Mallory Turrubiartes: Hmm.

316
00:30:02.110 --> 00:30:04.619
FQ Kristin Johnson: And Mellie, we're right at the 12…

317
00:30:04.740 --> 00:30:07.720
FQ Kristin Johnson: Mark, that hour mark, are you okay to go long, or do you need to.

318
00:30:07.720 --> 00:30:09.550
FQ Mallory Turrubiartes: I'm good. Okay. I'm good.

319
00:30:11.250 --> 00:30:19.089
FQ Mallory Turrubiartes: I don't know. I don't know… because I don't feel like it's helpful to have, like, so many messaging… like, so much messaging on a single screen.

320
00:30:19.110 --> 00:30:19.760
FQ Kristin Johnson: Hmm.

321
00:30:25.900 --> 00:30:27.570
FQ Mallory Turrubiartes: I don't know.

322
00:30:27.800 --> 00:30:35.990
FQ Kristin Johnson: But, so, and that's okay, we don't need to solve it now, but it was really helpful site to have that, so that's something that we can take back. I was just curious if something, like, came immediately.

323
00:30:35.990 --> 00:30:37.299
FQ Mallory Turrubiartes: Yeah, no, no, by the…

324
00:30:37.300 --> 00:30:39.299
FQ Kristin Johnson: The inside is perfect, so thank you.

325
00:30:39.300 --> 00:30:43.290
FQ Mallory Turrubiartes: Okay, okay. Alright, so… I'm gonna go ahead…

326
00:30:44.370 --> 00:30:48.699
FQ Mallory Turrubiartes: Well, I'll do Save as Drop, because I'm kind of curious what it looks like, right?

327
00:30:48.700 --> 00:30:52.220
FQ Kristin Johnson: I think you might have to click the green button. It's just the way that things are…

328
00:30:52.220 --> 00:30:54.500
FQ Mallory Turrubiartes: I don't like that one. That was what I wanted to do anyway, so that's.

329
00:30:54.500 --> 00:30:55.330
FQ Alex Kearns: That's good.

330
00:30:55.330 --> 00:30:59.010
FQ Mallory Turrubiartes: Okay, so then… Okay, I assume…

331
00:30:59.170 --> 00:31:03.840
FQ Mallory Turrubiartes: These look like current existing connections that have already been created.

332
00:31:04.550 --> 00:31:13.020
FQ Mallory Turrubiartes: Okay, so this is connected. It's not currently connected to any entities.

333
00:31:13.750 --> 00:31:19.409
FQ Mallory Turrubiartes: So, one question… so this is kind of different than how we have things today, in that

334
00:31:20.530 --> 00:31:24.889
FQ Mallory Turrubiartes: at least, like, from an ERP, Perspective, you can't.

335
00:31:25.100 --> 00:31:29.869
FQ Mallory Turrubiartes: connect… build a connection into an ERP without also, at the same time.

336
00:31:30.420 --> 00:31:41.930
FQ Mallory Turrubiartes: creating an entity that would be associated with that ERP, like, we don't have, at least to my knowledge, a process available for, like, just creating a connection to NetSuite, and then you can come back and do whatever with it later.

337
00:31:42.290 --> 00:31:48.449
FQ Mallory Turrubiartes: So I think this is kind of cool. I think that's a cool thing enhancement.

338
00:31:49.260 --> 00:31:51.889
FQ Mallory Turrubiartes: But then, I would come in…

339
00:31:53.240 --> 00:31:56.860
FQ Kristin Johnson: Okay, so let's say it's a… oh, you figured it out. What did you do?

340
00:31:56.860 --> 00:32:00.449
FQ Mallory Turrubiartes: I hit the three little dots, on the bar.

341
00:32:00.450 --> 00:32:08.690
FQ Kristin Johnson: Because let's say, let's say it was 2 days later, and you got your email saying, Mallory, your data's now loaded. And so you clicked that link in that email.

342
00:32:08.880 --> 00:32:10.319
FQ Kristin Johnson: And you land here.

343
00:32:10.910 --> 00:32:13.449
FQ Mallory Turrubiartes: Into… so you would come to this specific screen.

344
00:32:14.250 --> 00:32:15.020
FQ Mallory Turrubiartes: Okay.

345
00:32:15.260 --> 00:32:17.350
FQ Mallory Turrubiartes: And so this, then…

346
00:32:17.560 --> 00:32:31.970
FQ Mallory Turrubiartes: shows all of the different, number one, NetSuite fields, and then the kind of, standardized, I guess, like, Flowcast fields that map to the original NetSuite fields.

347
00:32:32.560 --> 00:32:38.020
FQ Mallory Turrubiartes: So you can come in and scroll.

348
00:32:39.090 --> 00:32:44.679
FQ Mallory Turrubiartes: So currently, we're looking at the GL lines table.

349
00:32:44.810 --> 00:32:47.810
FQ Mallory Turrubiartes: But I could switch to, maybe?

350
00:32:48.050 --> 00:32:50.060
FQ Kristin Johnson: Yeah, and you won't be able to click through, but…

351
00:32:50.060 --> 00:32:50.770
FQ Mallory Turrubiartes: Okay.

352
00:32:50.770 --> 00:32:54.629
FQ Kristin Johnson: proper. If you… if you went to transactions, we would show you the transaction data.

353
00:32:54.630 --> 00:33:01.250
FQ Mallory Turrubiartes: One question just for me to know. If I were to click into transactions, is it…

354
00:33:02.100 --> 00:33:09.329
FQ Mallory Turrubiartes: going to show me all of the transactions that have come in, or is it gonna show me, like, specifically the fields, or the, like.

355
00:33:09.480 --> 00:33:14.060
FQ Mallory Turrubiartes: like, what data I would be looking at if I was looking at my transactional data.

356
00:33:14.060 --> 00:33:15.299
FQ Kristin Johnson: What should it be?

357
00:33:16.960 --> 00:33:20.440
FQ Mallory Turrubiartes: Mmm… Hmm.

358
00:33:21.670 --> 00:33:26.279
FQ Mallory Turrubiartes: I feel like probably the latter, meaning, like, the…

359
00:33:26.640 --> 00:33:33.920
FQ Mallory Turrubiartes: almost like, like when you're setting a pivot table, like, you get that little bar on the side of, like, these are the fields that I want to pull in or not pull in.

360
00:33:34.270 --> 00:33:43.180
FQ Mallory Turrubiartes: Or, like, the fields that are available to me, I guess. And then… the actual transactional

361
00:33:43.900 --> 00:33:45.860
FQ Mallory Turrubiartes: data, I would think…

362
00:33:46.720 --> 00:33:56.569
FQ Mallory Turrubiartes: would show up when it's been connected to, like, either a module or, like, a specific GL account, I think, is how I would see that.

363
00:33:56.980 --> 00:33:59.150
FQ Mallory Turrubiartes: And then, like, the accounts…

364
00:33:59.450 --> 00:34:08.680
FQ Mallory Turrubiartes: I guess kind of contradicts that, because in my head, that would be, like, my COA, basically. Like, I would see my entire COA, if I click on the accounts, these are all the accounts that have been pulled in from NetSuite.

365
00:34:11.080 --> 00:34:15.419
FQ Mallory Turrubiartes: So I guess that kind of contrad… or is, like, different than what I would expect.

366
00:34:16.159 --> 00:34:18.619
FQ Mallory Turrubiartes: from transactions, but I just think…

367
00:34:21.850 --> 00:34:23.439
FQ Kristin Johnson: If you have thoughts on that?

368
00:34:28.320 --> 00:34:33.310
FQ Alex Kearns: Just meaning, like, that the fields are not what you… kind of expect?

369
00:34:33.310 --> 00:34:40.980
FQ Mallory Turrubiartes: Well, no, I mean, like, I guess what I… so, like, from a tran… like, if I were to click into transactions, in my head, this would not then show me

370
00:34:41.190 --> 00:34:47.540
FQ Mallory Turrubiartes: all of my NetSuite transactions, like, it wouldn't show me all, you know, however many lines of transactions I have, because

371
00:34:47.790 --> 00:34:50.810
FQ Mallory Turrubiartes: I think that's just not realistic, considering, like.

372
00:34:51.429 --> 00:35:01.209
FQ Mallory Turrubiartes: at least to my… I wouldn't think there's, like, a period selector or anything where you would be able to say, like, okay, give me this specific subset of transactions. So I would think this would be kind of similar to…

373
00:35:01.710 --> 00:35:04.499
FQ Mallory Turrubiartes: This current table, to where you can see, like.

374
00:35:04.810 --> 00:35:12.599
FQ Mallory Turrubiartes: all of the pieces of information that are going to be available for my transactions when I get to a point of, like, viewing those transactions.

375
00:35:12.970 --> 00:35:19.720
FQ Mallory Turrubiartes: But then accounts, to me, I would think, would show me, essentially, my COA. Like, I would get…

376
00:35:19.720 --> 00:35:20.420
FQ Alex Kearns: A list.

377
00:35:20.420 --> 00:35:20.939
FQ Mallory Turrubiartes: of a case.

378
00:35:20.940 --> 00:35:26.030
FQ Alex Kearns: So, just based on, like, the size of these datasets.

379
00:35:26.420 --> 00:35:36.319
FQ Alex Kearns: it sounds like, just to kind of play back, is that, like, for datasets that are gonna be, like, really large, and change over time, right? So we've got, like.

380
00:35:37.050 --> 00:35:42.780
FQ Alex Kearns: GL lines, transactions, maybe you'd have…

381
00:35:43.020 --> 00:35:59.150
FQ Alex Kearns: even, like, your, you know, TB or, you know, some other datasets, because those are, like, period-based, right? Like, if you were to load all history, that wouldn't really be useful or meaningful, but you're saying for some of these, like, your chart of accounts.

382
00:35:59.990 --> 00:36:06.009
FQ Alex Kearns: it's actually fairly consistent, and should be relatively small. And so you're saying, like.

383
00:36:07.280 --> 00:36:17.279
FQ Alex Kearns: Maybe not that you don't want to see what columns are there, but maybe that there is a benefit in the customer seeing, sort of, like.

384
00:36:17.490 --> 00:36:26.670
FQ Alex Kearns: a preview of what that data looks like so they can be confident in what we're pulling in. Is that right? It's not necessarily that you don't want to see, like.

385
00:36:26.680 --> 00:36:38.679
FQ Alex Kearns: this view, it's just that, like, accounts is a small enough data set that you'd want to be able to, like, get your hands on the data, so to speak, to be confident that things are working correctly.

386
00:36:38.680 --> 00:36:41.110
FQ Mallory Turrubiartes: Because I will say, today.

387
00:36:41.590 --> 00:36:50.800
FQ Mallory Turrubiartes: clients are not able to just come and, like, view their COA outside of clicking the accounts drop-down and kind of, like, scrolling through, so I think

388
00:36:51.270 --> 00:37:09.990
FQ Mallory Turrubiartes: to me, an accounts table would be a list of accounts, I guess, like… like a COA. Whereas, to your point, like, these larger, like, very variable types of data sets, like transactions, I wouldn't expect to be able to come in and see a full list, because even in NetSuite, you have to give it…

389
00:37:10.100 --> 00:37:16.009
FQ Mallory Turrubiartes: prompts, or, like, set criteria of, like, okay, this is the date range, or, you know, whatever that I want to see.

390
00:37:16.500 --> 00:37:18.770
FQ Alex Kearns: Hmm, that's really interesting.

391
00:37:19.150 --> 00:37:37.410
FQ Kristin Johnson: Yeah, and so the other thing I would say… so… and so, Alex, part of this is, like, whatever we can get from Fiveturn, right? That's question one. Question two, then, Mallory, back to you, would be, what if it was just sample data? What if it was just a table, like, 20 rows? Like, here's a sample set of, like, your transactions, here's a… and I see what you're saying with the accounts.

392
00:37:37.410 --> 00:37:42.290
FQ Kristin Johnson: But maybe for accounts, there's, like, a toggle where you could be like, show me all my accounts, show me my sample data from ASM.

393
00:37:42.290 --> 00:37:46.389
FQ Mallory Turrubiartes: Yeah, yeah. I think absolutely that would be helpful, because I think…

394
00:37:47.190 --> 00:38:01.579
FQ Mallory Turrubiartes: having a preview, whether or not it's your data, I think is helpful for a client to, like, actually say, oh yeah, that's… that's gonna be really helpful, or, like, that's all the information I was expecting, or, you know, whatever. I think that, realistically, would be very helpful.

395
00:38:01.810 --> 00:38:11.700
FQ Kristin Johnson: Okay, so then the other thing we need to do… to do, in addition to everything else, is if we are going to show final data here, we need to be very clear, it's just a… it's a snapshot, it's a sample, like a subset.

396
00:38:11.700 --> 00:38:12.270
FQ Mallory Turrubiartes: Right.

397
00:38:12.270 --> 00:38:13.559
FQ Kristin Johnson: First 20 lines, or whatever.

398
00:38:13.560 --> 00:38:23.219
FQ Mallory Turrubiartes: Yeah, yeah. And even if it's not, like, even if it's not their actual data, I think showing just dummy data even is fine. I mean, obviously with, like, a… if that's what it is.

399
00:38:23.220 --> 00:38:30.319
FQ Kristin Johnson: Oh, wow, that's interesting, because I would not think that's fine. I think they… I would think they would look at that dummy data and freak out.

400
00:38:30.470 --> 00:38:32.029
FQ Mallory Turrubiartes: Oh, really? Okay. I mean…

401
00:38:32.030 --> 00:38:40.470
FQ Alex Kearns: That's my assumption, too, because I was just thinking that they might think the connection is not… working, like…

402
00:38:40.470 --> 00:38:42.409
FQ Kristin Johnson: They have the wrong data, or anything like that.

403
00:38:42.410 --> 00:38:42.760
FQ Alex Kearns: again.

404
00:38:42.760 --> 00:38:43.230
FQ Mallory Turrubiartes: Yeah.

405
00:38:43.230 --> 00:38:43.629
FQ Kristin Johnson: Oh my god.

406
00:38:44.560 --> 00:38:49.090
FQ Kristin Johnson: Yeah, my point is, like, why would we show them dummy data?

407
00:38:49.090 --> 00:39:04.230
FQ Mallory Turrubiartes: I just meant if it's, like, not pos… like, if there's, like, I don't know, if it's not possible to do, like, their data, I think regardless, it would just be helpful to, like, get a visual of, like, okay, if I select this field, that's what it's gonna look like when it comes in, versus, like…

408
00:39:04.230 --> 00:39:09.190
FQ Mallory Turrubiartes: Yeah, I mean, obviously their data would definitely be more beneficial than Don't, but I…

409
00:39:09.400 --> 00:39:10.400
FQ Kristin Johnson: Yeah. Okay.

410
00:39:10.570 --> 00:39:15.830
FQ Mallory Turrubiartes: No, no, I was just gonna say, but I think in general, just, like, having a view, like a…

411
00:39:16.070 --> 00:39:26.810
FQ Mallory Turrubiartes: like a, you know, like, okay, sample, this is what it's gonna look like if you select all of these fields, you know, then I think regardless of if it's theirs or not, I think it would still be helpful to see.

412
00:39:27.070 --> 00:39:29.470
FQ Alex Kearns: So is part of that just…

413
00:39:29.670 --> 00:39:33.769
FQ Alex Kearns: Because the name of the field, you don't…

414
00:39:33.920 --> 00:39:51.449
FQ Alex Kearns: And, like, the type that it is, is not necessarily gonna give them the context for what it is. Is that kind of a component of what you're thinking for there? Is, like, giving them some value gives them, like, a scaffold of… of what.

415
00:39:51.450 --> 00:39:51.769
FQ Mallory Turrubiartes: I was more.

416
00:39:51.770 --> 00:39:52.130
FQ Alex Kearns: fair.

417
00:39:52.130 --> 00:40:04.240
FQ Mallory Turrubiartes: tangible, I think. Like, for example, some of these, I think, probably are clear, but, like, this one, the decimal 10.2, I transparently don't really know what that would look like coming in.

418
00:40:04.780 --> 00:40:09.860
FQ Mallory Turrubiartes: So I think, like, having, .

419
00:40:10.320 --> 00:40:10.700
FQ Alex Kearns: Yeah.

420
00:40:10.700 --> 00:40:22.999
FQ Mallory Turrubiartes: some kind of sample number to show that would be helpful. More so than just, like, this. To me, I'm not really sure what that means. I mean, text, obviously, is pretty standard Instagram, I think that makes sense.

421
00:40:23.250 --> 00:40:28.279
FQ Mallory Turrubiartes: This, I think, means character.

422
00:40:29.290 --> 00:40:33.829
FQ Mallory Turrubiartes: Like, dollar sign versus, you know, whatever, but, I think…

423
00:40:34.450 --> 00:40:39.930
FQ Mallory Turrubiartes: Maybe even that could be helpful to kind of clarify a little bit what that means.

424
00:40:41.990 --> 00:40:54.569
FQ Mallory Turrubiartes: So I don't know if that necessarily means changing them, but having either a sample so that they can see if they change the type, or that, you know, they change whatever… what that changes it to, or some kind of, like.

425
00:40:55.350 --> 00:40:56.920
FQ Mallory Turrubiartes: Guide, almost.

426
00:40:57.210 --> 00:41:00.270
FQ Mallory Turrubiartes: Of, like, what each of these things mean.

427
00:41:00.470 --> 00:41:06.050
FQ Kristin Johnson: Yeah, so in this view, I see what you're saying. In this view, if we did sample data, it could almost be column, example.

428
00:41:06.050 --> 00:41:07.279
FQ Mallory Turrubiartes: Yeah, yeah.

429
00:41:07.280 --> 00:41:12.310
FQ Kristin Johnson: For example, you're seeing, you know, ABC123 account ID, it's like 000123 amount.

430
00:41:13.070 --> 00:41:14.720
FQ Kristin Johnson: $107, okay.

431
00:41:14.720 --> 00:41:15.910
FQ Mallory Turrubiartes: Yep, yep.

432
00:41:16.760 --> 00:41:31.360
FQ Alex Kearns: Okay. Yeah, that helps a lot. I think, the decimal 10 comma 2, I believe that's saying it's a number that's 10 characters long, and then you'll have two decimal places.

433
00:41:31.360 --> 00:41:32.340
FQ Mallory Turrubiartes: Okay.

434
00:41:32.590 --> 00:41:33.840
FQ Alex Kearns: Yeah, I would… echo.

435
00:41:33.840 --> 00:41:35.970
FQ Kristin Johnson: This is generated by Claude, so…

436
00:41:35.970 --> 00:41:37.310
FQ Mallory Turrubiartes: Yeah. I have no idea.

437
00:41:37.310 --> 00:41:40.909
FQ Kristin Johnson: I feel like what we're gonna get back from Pride Tran. So, you know.

438
00:41:41.310 --> 00:41:41.730
FQ Mallory Turrubiartes: Okay.

439
00:41:41.730 --> 00:41:42.310
FQ Kristin Johnson: Hello.

440
00:41:42.640 --> 00:41:47.649
FQ Mallory Turrubiartes: Yeah. Okay, cool. Let me go through and make sure…

441
00:41:49.650 --> 00:41:52.209
FQ Mallory Turrubiartes: This, I'm just curious, cause, oh.

442
00:41:53.280 --> 00:42:02.150
FQ Mallory Turrubiartes: I just hovered. Oh, okay. Find table. So, I see we have standard tables, but then there's, like, the search bar.

443
00:42:02.870 --> 00:42:08.229
FQ Mallory Turrubiartes: Are you able to create new tables? Or…

444
00:42:08.930 --> 00:42:17.150
FQ Mallory Turrubiartes: Like, the fine table to me is interesting if the only option are these three, but then the language of standard tables makes me think…

445
00:42:17.380 --> 00:42:22.070
FQ Mallory Turrubiartes: That there's the possibility of having a non-standard table?

446
00:42:22.690 --> 00:42:24.110
FQ Mallory Turrubiartes: So that, I think…

447
00:42:24.690 --> 00:42:31.630
FQ Kristin Johnson: That's a correct expectation for now. They're not supported for the initial release, so it would only be required tables.

448
00:42:31.630 --> 00:42:32.410
FQ Mallory Turrubiartes: Okay.

449
00:42:34.850 --> 00:42:46.459
FQ Kristin Johnson: And then, for the lookup, you would be able to go ahead and, you know, do some sort of keyword. We're also looking at whether or not there's filters you could get down to, like, table type, like, is it AR, AP?

450
00:42:46.460 --> 00:42:47.080
FQ Mallory Turrubiartes: Okay.

451
00:42:47.080 --> 00:42:49.229
FQ Kristin Johnson: jar.

452
00:42:50.590 --> 00:42:56.569
FQ Kristin Johnson: One, and sorry, one question there I wanted to ask you about, but my brain is fried, so it is…

453
00:42:57.350 --> 00:42:58.000
FQ Kristin Johnson: It's gone.

454
00:43:03.770 --> 00:43:05.540
FQ Kristin Johnson: Yeah, sorry.

455
00:43:05.540 --> 00:43:08.470
FQ Mallory Turrubiartes: No, that's okay. If it comes back, we can…

456
00:43:08.570 --> 00:43:11.589
FQ Kristin Johnson: Can you go ahead and hit the next button for me?

457
00:43:11.590 --> 00:43:12.260
FQ Mallory Turrubiartes: Yes.

458
00:43:15.000 --> 00:43:20.490
FQ Mallory Turrubiartes: Okay… So this is that same screen that we had looked at originally.

459
00:43:20.790 --> 00:43:25.689
FQ Mallory Turrubiartes: So this is what, then, it would look like once it's been fully loaded.

460
00:43:26.000 --> 00:43:33.179
FQ Kristin Johnson: So, from what you said, it sounds like it would be helpful at least to see GL line standard.

461
00:43:33.180 --> 00:43:33.820
FQ Mallory Turrubiartes: Yep.

462
00:43:33.820 --> 00:43:45.740
FQ Kristin Johnson: And we don't, you know, we won't include a column count, but even… even having that visibility into what tables are coming in, assuming that we are also showing it in the sidebar to then… to be… carry that information through.

463
00:43:45.740 --> 00:43:50.670
FQ Mallory Turrubiartes: Yeah, I think so. Like, I think this is much… more…

464
00:43:51.160 --> 00:43:58.930
FQ Mallory Turrubiartes: like, easy to understand and, like, immediately know, like, oh, okay, these are the tables that you're talking about, whereas if you just show tables, it's kind of like…

465
00:43:59.940 --> 00:44:05.479
FQ Mallory Turrubiartes: what… what does that mean? And I think this makes it a lot more clear, like this kind of view.

466
00:44:06.070 --> 00:44:06.710
FQ Kristin Johnson: Okay.

467
00:44:07.560 --> 00:44:13.999
FQ Mallory Turrubiartes: Okay, okay, so I'm gonna hit Save Updates.

468
00:44:15.960 --> 00:44:16.730
FQ Mallory Turrubiartes: Okay.

469
00:44:17.510 --> 00:44:18.380
FQ Mallory Turrubiartes: I bet.

470
00:44:18.520 --> 00:44:20.849
FQ Kristin Johnson: You've done the full loop. Yay, okay.

471
00:44:21.810 --> 00:44:23.910
FQ Mallory Turrubiartes: Sorry, I talked so much.

472
00:44:23.910 --> 00:44:29.039
FQ Kristin Johnson: So we're grateful that you're actually giving us, like, 15 extra minutes that we

473
00:44:30.700 --> 00:44:35.879
FQ Kristin Johnson: Thank you for coming. Having… having been through all that, and again, you had a ton of great insight.

474
00:44:36.010 --> 00:44:40.430
FQ Kristin Johnson: Anything else that you would suggest, or just observations?

475
00:44:41.800 --> 00:44:45.290
FQ Mallory Turrubiartes: Hmm.

476
00:44:47.950 --> 00:44:49.230
FQ Mallory Turrubiartes: I'm trying to think.

477
00:44:52.820 --> 00:44:55.140
FQ Mallory Turrubiartes: I don't think so,

478
00:44:56.630 --> 00:45:16.260
FQ Mallory Turrubiartes: one thing, I don't know if this is, like, gonna come or not, I see, like, we have one entity, but it… I don't know if it's clickable, I don't know. But, like, if you would be… and again, I know this is just, like, a prototype, but, like, from here, if it's gonna say one entity, I think, realistically, a client should be able to click in and see which entities are connected to that, so almost like a summary view.

479
00:45:17.230 --> 00:45:24.120
FQ Mallory Turrubiartes: Because one entity is, you know, cool, but I want to know specifically, like, what entities, are connected here.

480
00:45:24.370 --> 00:45:25.040
FQ Kristin Johnson: Hmm.

481
00:45:25.620 --> 00:45:36.149
FQ Mallory Turrubiartes: And then, other thing, because I just see that we have the carrots, oh, takes you into…

482
00:45:36.150 --> 00:45:37.420
FQ Kristin Johnson: prototype.

483
00:45:37.420 --> 00:45:39.490
FQ Mallory Turrubiartes: No, no, no, obviously, I'm just kind of like…

484
00:45:40.230 --> 00:45:42.649
FQ Mallory Turrubiartes: I'm curious. Okay, let me go back.

485
00:45:42.650 --> 00:45:47.710
FQ Kristin Johnson: It would expand that view for you, and you would get some additional information. Is there certain information you're looking for?

486
00:45:48.470 --> 00:45:53.870
FQ Mallory Turrubiartes: Mmm… I don't think so.

487
00:45:53.870 --> 00:45:58.100
FQ Kristin Johnson: You can either hit the next or the browser back, either one will get you to that view.

488
00:45:58.100 --> 00:45:59.820
FQ Mallory Turrubiartes: Gotcha.

489
00:46:01.150 --> 00:46:08.480
FQ Mallory Turrubiartes: I don't think so, I think I was more just curious, like, what information would come in, more than, like, I had an expectation of what I would see.

490
00:46:09.860 --> 00:46:12.710
FQ Mallory Turrubiartes: I don't know, I may have struck myself, but that's okay.

491
00:46:13.020 --> 00:46:14.869
FQ Mallory Turrubiartes: No, I don't think so. I think…

492
00:46:15.810 --> 00:46:21.899
FQ Mallory Turrubiartes: more… I was just more of… I was curious what… what would come up if I did click that. But,

493
00:46:23.050 --> 00:46:26.149
FQ Mallory Turrubiartes: No, I think this is really cool.

494
00:46:27.010 --> 00:46:30.219
FQ Mallory Turrubiartes: I'm definitely intrigued to see, kind of, like.

495
00:46:30.360 --> 00:46:35.929
FQ Mallory Turrubiartes: how it would come about, and, like, in what steps of the setup process, because I do think, obviously, like.

496
00:46:39.550 --> 00:46:48.740
FQ Mallory Turrubiartes: like, we need, I think, unless that changes, like, we'd have to be able to build… we still have to build an initial connection to either an ERP or SFTP,

497
00:46:48.910 --> 00:46:50.500
FQ Mallory Turrubiartes: During setup.

498
00:46:51.070 --> 00:46:51.770
FQ Mallory Turrubiartes: Nope.

499
00:46:52.090 --> 00:46:58.570
FQ Mallory Turrubiartes: But… so that would be… I would just be curious to see, like, how that looks, to them.

500
00:46:59.200 --> 00:47:08.330
FQ Mallory Turrubiartes: And then… but I think, like, once the established, I think the way that it looks now totally makes sense for, like, oh, okay, we have another ERP we need to connect to, which I think actually is…

501
00:47:08.600 --> 00:47:19.900
FQ Mallory Turrubiartes: from a setup standpoint, going to be easier than what it is today, because today you have to go through the process of actually creating the entity, so I think this will be better from the client's perspective, to just, like.

502
00:47:20.750 --> 00:47:29.639
FQ Mallory Turrubiartes: basically provide them the guide of, here's how to connect to NetSuite, and then, you know, whatever steps are required for them to get into the Data Studio, but I think…

503
00:47:30.050 --> 00:47:33.430
FQ Mallory Turrubiartes: On a setup standpoint, that actually will be much better for them.

504
00:47:34.080 --> 00:47:35.060
FQ Alex Kearns: Oh, that's awesome.

505
00:47:35.320 --> 00:47:38.249
FQ Mallory Turrubiartes: So, very cool. I like it.

506
00:47:44.470 --> 00:47:45.960
FQ Alex Kearns: Kristen's maybe back.

507
00:47:45.960 --> 00:47:46.510
FQ Mallory Turrubiartes: Gotcha.

508
00:47:46.510 --> 00:47:46.880
FQ Alex Kearns: out.

509
00:47:46.880 --> 00:47:51.090
FQ Mallory Turrubiartes: We have an empty blurry chair, it looks like.

510
00:47:52.450 --> 00:47:53.150
FQ Mallory Turrubiartes: Cool.

511
00:47:53.150 --> 00:47:55.339
FQ Alex Kearns: Maybe a dead computer or something.

512
00:47:55.340 --> 00:47:59.700
FQ Mallory Turrubiartes: Yeah, that's what I said, it was just, like, so abrupt, so probably something like that.

513
00:48:00.800 --> 00:48:05.220
FQ Alex Kearns: Yeah, this was so helpful, I think…

514
00:48:06.510 --> 00:48:10.200
FQ Alex Kearns: It's really nice to have just some additional perspective on.

515
00:48:10.200 --> 00:48:10.660
FQ Mallory Turrubiartes: Okay.

516
00:48:10.660 --> 00:48:17.509
FQ Alex Kearns: Like, what we're… building, especially because I think we've all been thinking about this a lot, and sometimes

517
00:48:18.450 --> 00:48:24.090
FQ Alex Kearns: like, having additional perspective is really helpful. Yeah. Appreciate your insights so much.

518
00:48:24.300 --> 00:48:24.940
FQ Mallory Turrubiartes: Yes.

519
00:48:24.940 --> 00:48:27.990
FQ Kristin Johnson: Oh, you guys, my internet, like, totally browned out.

520
00:48:28.160 --> 00:48:29.189
FQ Mallory Turrubiartes: No, it's okay.

521
00:48:29.190 --> 00:48:29.950
FQ Kristin Johnson: Patrick's like, oh my god.

522
00:48:29.950 --> 00:48:32.839
FQ Mallory Turrubiartes: We assumed you didn't just, like, ditch us.

523
00:48:33.510 --> 00:48:34.059
FQ Mallory Turrubiartes: I'm like.

524
00:48:34.060 --> 00:48:35.980
FQ Alex Kearns: Friday?

525
00:48:36.220 --> 00:48:39.440
FQ Mallory Turrubiartes: Actually, it's 1218, I'm outta here.

526
00:48:39.440 --> 00:48:44.140
FQ Kristin Johnson: Natasha, can we meet at 12.30 instead of now?

527
00:48:44.450 --> 00:48:47.369
FQ Kristin Johnson: All right. Thank you so much, Mallory, super appreciate it.

528
00:48:47.370 --> 00:48:52.790
FQ Mallory Turrubiartes: Yeah, thank you guys. If you have any other questions or anything, always open, so just let me know.

529
00:48:52.790 --> 00:48:54.400
FQ Kristin Johnson: Completely appreciate it. Thank you.

530
00:48:54.400 --> 00:48:55.560
FQ Mallory Turrubiartes: Alright, bye guys, thank you.

531
00:48:55.830 --> 00:48:56.550
FQ Alex Kearns: Thank you.

