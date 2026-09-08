# Transcript — Session 001

**Date:** 2026-05-07
**Study:** Connector Setup — API Connection Flow
**Participant:** Lilith Chrakian (FloQast Senior ATC)
**Facilitators:** Kristin Johnson, Natasha Clark

---


1
00:00:25.400 --> 00:00:27.380
FQ Alex Kearns: Hey, Natasha!

2
00:00:29.320 --> 00:00:35.599
FQ - Natasha Clark: Kristen and I actually managed to get our two pieces.

3
00:00:35.970 --> 00:00:41.510
FQ - Natasha Clark: of the… create connector experience put together in one prototype. It was very easy.

4
00:00:41.740 --> 00:00:42.420
FQ - Natasha Clark: That's cool.

5
00:00:42.420 --> 00:00:43.130
FQ Alex Kearns: Cool.

6
00:00:43.370 --> 00:00:46.250
FQ - Natasha Clark: So… It's got the beginning part.

7
00:00:46.730 --> 00:00:47.500
FQ Alex Kearns: That's awesome.

8
00:00:48.000 --> 00:00:49.099
FQ Kristin Johnson: Hello, Lilith!

9
00:00:49.100 --> 00:00:49.880
FQ - Lilith Chrakian: Hi!

10
00:00:49.880 --> 00:00:51.100
FQ - Natasha Clark: Hello! How are you?

11
00:00:51.230 --> 00:00:52.060
FQ Kristin Johnson: Thank you.

12
00:00:53.140 --> 00:00:55.620
FQ Kristin Johnson: A willing guinea pig. Sure.

13
00:00:55.620 --> 00:00:58.719
FQ - Lilith Chrakian: I hope I'll be helpful. 100%.

14
00:00:58.720 --> 00:01:00.670
FQ Alex Kearns: You will, no doubt, no doubt.

15
00:01:01.100 --> 00:01:01.590
FQ - Lilith Chrakian: Okay.

16
00:01:01.590 --> 00:01:04.410
FQ Kristin Johnson: So, the, the…

17
00:01:04.410 --> 00:01:28.419
FQ Kristin Johnson: here's what's happening. We, the Data Studio team is working on what are ways that we can… we can lower the threshold, ideally for end customers, right, but at least for you guys, to bring more data in with more connections, right? Recognizing that accountants and maybe even some of the ATC folks aren't super on the, you know, extreme technical side, so know things about APIs, right? So we're trying to come up with an interface

18
00:01:28.580 --> 00:01:37.730
FQ Kristin Johnson: That, ideally, with very little training or advanced context, people can come in with some documentation provided to them by their technical team.

19
00:01:37.730 --> 00:01:58.550
FQ Kristin Johnson: Yeah. And to DIY it, right? So the point of this conversation, we're gonna… we're gonna give you a prototype that we've, you know, it's… it's not… it's not true to life, like, we use Claude AI to build it, so it doesn't… it doesn't matter, like, it's not checking the information you're putting in, you know, to say whether it's right or wrong, it'll just let you put in anything. Okay.

20
00:01:58.830 --> 00:02:13.890
FQ Kristin Johnson: We're wanting to see if you are able to interpret the technical documentation, and then get that into that input, and successfully go through the process of creating an API, and then get some of your feedback around it. And we want you to be brutally honest. If you're like, this is too complicated, this

21
00:02:13.900 --> 00:02:22.070
FQ Kristin Johnson: this page is horrible, I don't want to have to do this step 5 times. I mean, we're here to get that feedback from you, because, like, better now than with our customers, right?

22
00:02:22.370 --> 00:02:22.950
FQ - Lilith Chrakian: Yeah.

23
00:02:23.390 --> 00:02:44.469
FQ Kristin Johnson: So… so what I'm gonna do is… there's a few questions I wanted to ask you up front, and then I'm gonna… I'm actually gonna have you control my screen, and you're gonna engage via my screen, you're gonna have the documentation there, you're gonna have the, you know, the, the prototype there. I have to apologize to you in advance, because it's… we're just gonna let you struggle, but that's…

24
00:02:44.470 --> 00:02:44.950
FQ - Lilith Chrakian: Okay.

25
00:02:44.950 --> 00:02:47.249
FQ Kristin Johnson: Right? Because we're not testing you, we're testing…

26
00:02:47.250 --> 00:02:47.750
FQ - Lilith Chrakian: Okay.

27
00:02:47.750 --> 00:02:48.899
FQ Kristin Johnson: design. So…

28
00:02:48.900 --> 00:02:49.320
FQ - Lilith Chrakian: Okay.

29
00:02:49.320 --> 00:03:01.750
FQ Kristin Johnson: Anytime you're like, this is hard, I don't understand this, we're like, oh, we failed in the design to make it work for Lilith. So… so don't feel like there's any judgment or assessment on you at all. It is like, is the design performing for you?

30
00:03:01.900 --> 00:03:04.970
FQ - Lilith Chrakian: Okay, great, because I'm gonna be nervous having, like, 4 people staring at me.

31
00:03:04.970 --> 00:03:11.219
FQ Kristin Johnson: And again, like, there's, there's, like, there's no user error in this situation.

32
00:03:11.220 --> 00:03:12.580
FQ - Lilith Chrakian: Perfect.

33
00:03:12.580 --> 00:03:13.010
FQ Kristin Johnson: testing.

34
00:03:13.010 --> 00:03:13.689
FQ - Lilith Chrakian: Thank you for…

35
00:03:13.920 --> 00:03:14.750
FQ Kristin Johnson: Thank you for…

36
00:03:14.750 --> 00:03:15.669
FQ - Lilith Chrakian: Prefacing that.

37
00:03:16.000 --> 00:03:20.340
Rebecca Beasley-Cockroft (Sr. Product Manager): You have too big of an audience, because we are all trying to learn from this.

38
00:03:20.340 --> 00:03:21.390
FQ - Lilith Chrakian: Okay. Okay.

39
00:03:21.470 --> 00:03:22.130
Rebecca Beasley-Cockroft (Sr. Product Manager): Got it.

40
00:03:22.490 --> 00:03:25.069
Rebecca Beasley-Cockroft (Sr. Product Manager): That is not about you.

41
00:03:25.070 --> 00:03:42.780
FQ Kristin Johnson: That's actually very true. That is absolutely true. It's really… you're helping us test the design, and we just needed… we need a person with very little context to come in and help us test that design. Okay. The other thing that's super helpful for us is… is as, like, just kind of articulate what you're thinking out loud.

42
00:03:42.780 --> 00:03:59.470
FQ Kristin Johnson: Because it just helps us get your perspective, and again, like, oh my god, there's so many fields. Like, all those things, or this is really complicated, I don't understand this, that just lets us see where you are from your, like, mental space as you're going through this, again, because that's going to be really hard to get from customers. So you're kind of that proxy.

43
00:03:59.470 --> 00:04:05.910
FQ Kristin Johnson: Yeah. So let me ask you a few quick questions before I go ahead and do,

44
00:04:07.020 --> 00:04:20.439
FQ Kristin Johnson: give you the screen control. So one from… so let's consider scale 1 to 5, 1 being, like, nothing versus, like, expert, or novice versus expert. How knowledgeable are you about technical things like APIs?

45
00:04:20.440 --> 00:04:24.500
FQ - Lilith Chrakian: Ugh, not the best, like, two and a half.

46
00:04:24.770 --> 00:04:28.730
FQ Kristin Johnson: Okay, and based on… based on, you know, what…

47
00:04:28.730 --> 00:04:45.209
FQ - Lilith Chrakian: I understand the context of, like, what it does and things like that. Like, for example, like, cloud… I mean, SFTP API, like, I understand the overall, what we're trying to accomplish, not necessarily, like, the technical aspects of it.

48
00:04:45.420 --> 00:04:50.440
FQ Kristin Johnson: Perfect. Okay. And then, just based on our little intro, like.

49
00:04:50.630 --> 00:04:57.310
FQ Kristin Johnson: If you, if you just, like, throwing a guess out there, again, scale 1 to 5, how technically challenging do you anticipate this process to be?

50
00:04:57.490 --> 00:05:01.350
FQ - Lilith Chrakian: This one, I don't know,

51
00:05:01.850 --> 00:05:07.429
FQ - Lilith Chrakian: Or… I mean, I don't know, because you're trying to make it easy, so I don't know.

52
00:05:07.540 --> 00:05:08.270
FQ - Lilith Chrakian: The Woopbah.

53
00:05:08.270 --> 00:05:14.779
FQ Kristin Johnson: Poor's a good gut check, which is, like, you're still anticipating… I'm still guessing it's gonna be pretty challenging.

54
00:05:14.780 --> 00:05:22.519
FQ - Lilith Chrakian: Yeah. Oh, wait, I meant, like, I should be able to figure it out based on what you said, so maybe I meant a 2, not 4. I flipped it.

55
00:05:22.520 --> 00:05:31.239
FQ Kristin Johnson: Perfect. Okay, good for us. And then, what… how much effort do you think you're gonna have to put in to complete the process?

56
00:05:31.240 --> 00:05:33.510
FQ - Lilith Chrakian: Hmm… like a 4.

57
00:05:34.120 --> 00:05:36.139
FQ Kristin Johnson: Okay, so you still feel like…

58
00:05:36.290 --> 00:05:41.320
FQ Kristin Johnson: Even though, even though technically we've hopefully dumbed it down a little bit, it's still just gonna be arduous.

59
00:05:41.320 --> 00:05:42.270
FQ - Lilith Chrakian: Yeah, yeah.

60
00:05:42.270 --> 00:05:54.530
FQ Kristin Johnson: Okay, excellent, that's all good. Okay, so I'm gonna share my screen here, and I'm gonna show you a couple things, and then I'm gonna give you control, and you're gonna have my whole… well, let's do this, I'm gonna give you my whole Chrome.

61
00:05:54.560 --> 00:06:06.229
FQ Kristin Johnson: Okay, so let's get the zoomed… So this is in the world of a… let's just say that accounting user out there, where they're like, I need to set up an API, and I.

62
00:06:06.230 --> 00:06:06.670
FQ - Lilith Chrakian: Excuse me.

63
00:06:06.670 --> 00:06:08.800
FQ Kristin Johnson: They're like, here, use this, right?

64
00:06:09.200 --> 00:06:14.090
FQ Kristin Johnson: So you would be given a document similar to this, and you're then gonna go

65
00:06:14.290 --> 00:06:22.159
FQ Kristin Johnson: DIY it yourself to figure out how to set up that connection. So, that tab is right here at the top, hopefully you can see my tab.

66
00:06:22.750 --> 00:06:37.040
FQ Kristin Johnson: Oh, and sorry, I should have said something right at the top, Lilith. We're actually recording this, and again, it's just because we're gonna feed… we're gonna feed the transcript in to be able to extract, like, oh, you know, here's this insight, we should do something with it. So… Okay. Do I have your permission to record?

67
00:06:37.040 --> 00:06:37.590
FQ - Lilith Chrakian: Yeah.

68
00:06:37.590 --> 00:06:57.259
FQ Kristin Johnson: Okay, perfect. Then, here is our beautiful, prototype. It looks… looks like live HTML, it is not. It was just generated by Cloud. So, now that you know where the two things are, this is the thing that's gonna tell you what to do, this is the thing that's gonna tell you where to do it. Okay. Do you use multiple screens?

69
00:06:57.660 --> 00:06:58.860
FQ - Lilith Chrakian: I do, I do.

70
00:06:58.870 --> 00:07:08.820
FQ Kristin Johnson: What I can do is I can drop you the link here, and then you can have them side by side, so you can have my screen that you're controlling in one view, and then you can pull this API connection up in.

71
00:07:08.820 --> 00:07:09.390
FQ - Lilith Chrakian: Yes.

72
00:07:09.590 --> 00:07:11.460
FQ - Lilith Chrakian: Yes, that would be better.

73
00:07:11.460 --> 00:07:15.669
FQ Kristin Johnson: Let me… Let me do this…

74
00:07:17.880 --> 00:07:22.859
FQ Kristin Johnson: All right, so I'm going to drop the doc link there. Why don't you take a minute and pull that up in your other screen, and then we'll…

75
00:07:26.410 --> 00:07:27.420
FQ - Lilith Chrakian: Very cool.

76
00:07:28.290 --> 00:07:29.750
FQ - Lilith Chrakian: Okay, pulled up.

77
00:07:29.750 --> 00:07:54.280
FQ Kristin Johnson: You already? Okay. Then I'm gonna share my screen again, and I'm gonna give you full control. And Natasha… oh, and I'm sorry, Lilith, I should have introduced all of us. I'm one of the designers on Data Studio, Natasha is the other designer on Data Studio, and then Rebecca and Alex are the product managers, so they're the ones coming with all the things they think Natasha and I need to design, and then we're trying to do our best.

78
00:07:54.430 --> 00:07:57.049
FQ - Lilith Chrakian: Got it, got it. Nice to meet you all.

79
00:07:57.280 --> 00:07:57.920
FQ Kristin Johnson: Me too.

80
00:07:58.260 --> 00:08:03.409
FQ Kristin Johnson: Okay, and thank you again for your time. This is… this is actually very helpful for us, so…

81
00:08:03.700 --> 00:08:13.250
FQ Kristin Johnson: Alright, Natasha, you may need to give a little guidance, regarding the ad connector piece, because I'm just not sure…

82
00:08:13.550 --> 00:08:16.640
FQ Kristin Johnson: Alright, where's my remote control?

83
00:08:17.210 --> 00:08:25.229
FQ Kristin Johnson: And I'm gonna give it to Lilith. Okay, Lilith, you should now be able to move that cursor around and control the screen.

84
00:08:27.450 --> 00:08:28.960
FQ Kristin Johnson: Okay, perfect.

85
00:08:28.960 --> 00:08:31.470
FQ - Lilith Chrakian: Can I? You can see it? Oh, yeah, here it is. Okay, cool.

86
00:08:31.470 --> 00:08:32.710
FQ Kristin Johnson: So…

87
00:08:33.150 --> 00:08:41.739
FQ Kristin Johnson: Go! You can feel free to ask us questions. If we decide we can't answer, we won't answer and let you kind of struggle through it, but again, the struggling is what helps us understand.

88
00:08:41.740 --> 00:08:42.539
FQ - Lilith Chrakian: Okay.

89
00:08:43.190 --> 00:08:45.960
FQ - Lilith Chrakian: Cool, I already don't know what to do. No, I'm kidding.

90
00:08:45.960 --> 00:08:47.309
FQ Kristin Johnson: That's, that's great.

91
00:08:47.310 --> 00:08:47.750
FQ - Lilith Chrakian: That's.

92
00:08:47.750 --> 00:08:52.820
FQ Kristin Johnson: Seriously, that is exactly the type of feedback that's helpful to us.

93
00:08:52.820 --> 00:08:53.610
FQ - Lilith Chrakian: Okay.

94
00:08:54.020 --> 00:08:59.419
FQ - Lilith Chrakian: So this would not, I assume, which connection type,

95
00:09:03.550 --> 00:09:04.470
FQ - Lilith Chrakian: Oh, okay.

96
00:09:06.320 --> 00:09:08.590
FQ Kristin Johnson: Okay, real quickly, what was, what was the…

97
00:09:08.590 --> 00:09:23.070
FQ - Lilith Chrakian: Oh, I was trying… I could see that one was a file. Okay, well, now it… I wanted to… I forgot what I did. But, like, I could see that I had the API information, so, like, here's my API file, so that's what I would be using.

98
00:09:23.070 --> 00:09:23.900
FQ Kristin Johnson: Okay, perfect.

99
00:09:24.470 --> 00:09:27.780
FQ - Lilith Chrakian: Pre-built or custom.

100
00:09:28.630 --> 00:09:31.990
FQ - Lilith Chrakian: Okay, so… oh yeah, custom API, cool.

101
00:09:32.310 --> 00:09:38.800
FQ - Lilith Chrakian: Enter the API-based URL and authentication credentials. We'll cask will dentist.

102
00:09:39.260 --> 00:09:41.370
FQ - Lilith Chrakian: That the endpoint can be reached.

103
00:09:43.690 --> 00:09:49.510
FQ - Lilith Chrakian: Cool. Connection settings… Not pasting.

104
00:09:56.340 --> 00:09:57.269
FQ - Lilith Chrakian: Why isn't it?

105
00:09:58.230 --> 00:09:59.679
FQ - Lilith Chrakian: Oh. What?

106
00:10:00.010 --> 00:10:02.310
FQ - Lilith Chrakian: Oh, it's not copying from my…

107
00:10:02.690 --> 00:10:04.409
FQ Kristin Johnson: Oh no! Oh, I'm sorry about that.

108
00:10:04.460 --> 00:10:10.920
FQ - Lilith Chrakian: Hmm… I don't want to type these in, I want to make sure I can copy it. Okay.

109
00:10:12.410 --> 00:10:14.530
FQ - Lilith Chrakian: Maybe I need to do… No.

110
00:10:14.530 --> 00:10:19.739
FQ Kristin Johnson: Can you do me something really quick on the fly? Can you have Claude regenerate that doc as a…

111
00:10:20.140 --> 00:10:24.080
FQ - Lilith Chrakian: Or, if I request edit access, it wouldn't work?

112
00:10:25.380 --> 00:10:27.260
FQ Kristin Johnson: Oh, is it not letting you… okay.

113
00:10:27.260 --> 00:10:30.679
FQ - Lilith Chrakian: Yeah, I think I'm not… I'm not able to copy it.

114
00:10:30.680 --> 00:10:34.350
FQ Alex Kearns: Well, I wonder, too, is it that because you're…

115
00:10:34.350 --> 00:10:35.690
FQ Kristin Johnson: Right, she's not an editor.

116
00:10:35.690 --> 00:10:36.150
FQ Alex Kearns: Perfect.

117
00:10:36.150 --> 00:10:43.440
FQ Kristin Johnson: Okay, good catch, Lila, thanks. Okay, so refresh, hopefully that takes care of that, and I'm gonna hide my…

118
00:10:43.720 --> 00:10:44.330
FQ - Lilith Chrakian: Thank you.

119
00:10:44.330 --> 00:10:46.250
FQ Kristin Johnson: here really quickly. Okay.

120
00:10:46.680 --> 00:10:49.239
FQ Kristin Johnson: You should have full… is that working for you now?

121
00:10:49.420 --> 00:10:52.920
FQ - Lilith Chrakian: Let's see, copy… Lee's work.

122
00:10:58.020 --> 00:11:00.839
FQ - Lilith Chrakian: I don't know why I'm not able to use my shortcuts.

123
00:11:01.370 --> 00:11:02.989
FQ - Lilith Chrakian: Here, to paste.

124
00:11:02.990 --> 00:11:06.329
FQ Kristin Johnson: It might just be the weirdness of, oh, man.

125
00:11:06.330 --> 00:11:07.710
FQ - Lilith Chrakian: It's not working.

126
00:11:07.710 --> 00:11:15.580
FQ Kristin Johnson: Shoot, that… let me… let me try really quick, see if I can copy and paste, because this… this is going to make a really long process even longer. Not a really long…

127
00:11:15.580 --> 00:11:19.000
FQ - Natasha Clark: Using the paste from your machine, your clipboard.

128
00:11:19.140 --> 00:11:22.029
FQ Kristin Johnson: Yeah, that… oh, good point.

129
00:11:22.180 --> 00:11:23.340
FQ - Lilith Chrakian: What's happening?

130
00:11:23.650 --> 00:11:34.349
FQ Kristin Johnson: Yeah… Let me… If you download that doc, Copy, will that work?

131
00:11:34.770 --> 00:11:37.440
FQ - Lilith Chrakian: Like, do a… in Word? Are you talking to me?

132
00:11:37.870 --> 00:11:40.659
FQ Kristin Johnson: just download it straight out of… out of Google.

133
00:11:41.150 --> 00:11:44.420
FQ Alex Kearns: Gee, I think it's using your pace, though.

134
00:11:44.420 --> 00:11:45.619
FQ Kristin Johnson: Got it.

135
00:11:45.620 --> 00:11:47.729
FQ Alex Kearns: So that's not gonna help, because it keeps.

136
00:11:47.730 --> 00:11:49.270
FQ - Lilith Chrakian: Pasting, the last thing you.

137
00:11:49.270 --> 00:11:53.120
FQ Alex Kearns: And you copied and pasted, so, yeah.

138
00:11:53.120 --> 00:11:54.759
FQ - Lilith Chrakian: Oh, I see.

139
00:11:56.630 --> 00:12:03.259
FQ Kristin Johnson: Okay, I'm just trying to rapidly… okay, so why don't we do this? I'm gonna… I'm gonna be your hand, Silith, I'm gonna… I'm gonna take control back.

140
00:12:03.260 --> 00:12:04.160
FQ - Lilith Chrakian: Okay, okay.

141
00:12:04.160 --> 00:12:05.290
FQ Kristin Johnson: And you're gonna tell me what you.

142
00:12:05.290 --> 00:12:06.779
FQ - Lilith Chrakian: And I'll tell you what to do. Okay.

143
00:12:06.780 --> 00:12:10.550
FQ Kristin Johnson: But this is a super helpful learning, so Natasha will have to figure this one out.

144
00:12:10.550 --> 00:12:12.399
FQ - Natasha Clark: Yeah. Okay.

145
00:12:12.400 --> 00:12:16.920
FQ Kristin Johnson: The copy-paste is huge. Okay, so you're gonna, so we're copying this.

146
00:12:16.920 --> 00:12:18.300
FQ - Lilith Chrakian: URL, yep.

147
00:12:18.300 --> 00:12:19.840
FQ Kristin Johnson: And you… where do you want to put it?

148
00:12:19.900 --> 00:12:25.610
FQ - Lilith Chrakian: There. Display name… oh, no, display name, not there. Base URL, sorry, down there.

149
00:12:25.610 --> 00:12:26.200
FQ Kristin Johnson: Okay.

150
00:12:27.980 --> 00:12:30.929
FQ Kristin Johnson: Err… Oh, do you want to look at that form again?

151
00:12:30.930 --> 00:12:34.740
FQ - Lilith Chrakian: Yeah, can I look at that for… can you keep that one on, and then I'll tell you?

152
00:12:34.740 --> 00:12:35.080
FQ Kristin Johnson: Sure.

153
00:12:35.080 --> 00:12:39.790
FQ - Lilith Chrakian: Okay, so, health check URL. What the heck does that mean?

154
00:12:49.300 --> 00:12:50.320
FQ - Lilith Chrakian: API.

155
00:12:52.720 --> 00:12:53.660
FQ - Lilith Chrakian: Bing.

156
00:12:57.090 --> 00:13:03.889
FQ - Lilith Chrakian: Okay, I don't know what that means, but I'm gonna continue. Environment, does it… okay, start with…

157
00:13:03.890 --> 00:13:05.240
FQ Kristin Johnson: You say you don't know what means what.

158
00:13:05.240 --> 00:13:07.040
FQ - Lilith Chrakian: Health check URL.

159
00:13:07.040 --> 00:13:07.690
FQ Kristin Johnson: Okay.

160
00:13:10.500 --> 00:13:12.150
FQ - Lilith Chrakian: API.example.

161
00:13:13.750 --> 00:13:21.480
FQ - Lilith Chrakian: Okay. I don't know what health check means. Is that… That's not a… the… That's, like, a technical term.

162
00:13:23.660 --> 00:13:35.489
FQ Kristin Johnson: It is… yeah, and we don't need to worry about it. Okay, okay. It's essentially… it's just a way for us to know the path if we just wanted to ping the server, but actually not, you know, be calling a specific endpoint.

163
00:13:35.490 --> 00:13:44.469
FQ Kristin Johnson: But you're right, that's not in your documentation, so that's, again, that's how… that's helpful for under… for us to understand, like, what you're looking for versus what we're providing. Okay.

164
00:13:45.250 --> 00:13:54.219
FQ - Lilith Chrakian: Let's see. Okay, environments start with sandbox API version.

165
00:13:59.650 --> 00:14:03.799
FQ - Lilith Chrakian: Don't know what that means. Okay, can you click the drop-down?

166
00:14:04.530 --> 00:14:05.700
FQ Kristin Johnson: The drop-down for where?

167
00:14:05.810 --> 00:14:07.369
FQ - Lilith Chrakian: Auth type.

168
00:14:07.370 --> 00:14:08.160
FQ Kristin Johnson: Okay.

169
00:14:13.360 --> 00:14:16.780
FQ - Lilith Chrakian: I truly do know the least. Okay,

170
00:14:24.280 --> 00:14:26.010
FQ - Lilith Chrakian: Those are the… okay.

171
00:14:28.650 --> 00:14:32.230
FQ - Lilith Chrakian: Okay, so API key, that's fine.

172
00:14:32.420 --> 00:14:33.140
FQ Kristin Johnson: Okay.

173
00:14:33.940 --> 00:14:42.120
FQ - Lilith Chrakian: Api key… value. Okay, so then there's the API key on that, dock.

174
00:14:42.370 --> 00:14:44.140
FQ - Lilith Chrakian: Which is right there, yes.

175
00:14:53.650 --> 00:14:59.560
FQ - Lilith Chrakian: Okay, it does say environment production, but I assume…

176
00:15:00.220 --> 00:15:09.049
FQ - Lilith Chrakian: that I'm assuming, it does say start with sandbox before switching to production, like, I don't think that that matters, so I'm just gonna go with sandbox.

177
00:15:09.510 --> 00:15:11.780
FQ - Lilith Chrakian: Delivery…

178
00:15:12.010 --> 00:15:18.579
FQ Kristin Johnson: What would make you… what information do you feel you're missing there to make you more confident about that choice?

179
00:15:19.110 --> 00:15:25.370
FQ - Lilith Chrakian: Oh, I think it's just the fact that for the API connection details, it says production.

180
00:15:25.970 --> 00:15:30.099
FQ - Lilith Chrakian: So, like, that's, like, Yeah, I guess…

181
00:15:30.450 --> 00:15:35.600
FQ - Lilith Chrakian: I would go to… I would be going to… like, I would be doing production, right, for the environment.

182
00:15:36.440 --> 00:15:40.360
FQ - Lilith Chrakian: Because, like, I'm not using a sandbox of, like, the API.

183
00:15:40.470 --> 00:15:42.280
FQ - Lilith Chrakian: information, right?

184
00:15:42.870 --> 00:15:45.589
FQ - Lilith Chrakian: So I guess I would have to select production.

185
00:15:46.110 --> 00:15:47.460
FQ Kristin Johnson: When?

186
00:15:48.100 --> 00:15:48.720
FQ - Lilith Chrakian: if…

187
00:15:49.290 --> 00:15:57.219
FQ - Lilith Chrakian: If, like, that's the environment that I'm… oh, okay, so this is my… this is my thought process.

188
00:15:57.220 --> 00:15:57.860
FQ Kristin Johnson: Beautiful.

189
00:15:57.860 --> 00:16:09.640
FQ - Lilith Chrakian: Okay, so, my API… so, for my API, I'm connecting to my API instance, but I'm assuming that it's sandbox for Flowcast.

190
00:16:10.130 --> 00:16:13.720
FQ - Lilith Chrakian: Like, I'm connecting to a Flowcast sandbox environment, right?

191
00:16:14.220 --> 00:16:15.230
FQ - Lilith Chrakian: Or no?

192
00:16:15.460 --> 00:16:17.909
FQ Kristin Johnson: Rebecca? I believe so.

193
00:16:18.540 --> 00:16:22.020
Rebecca Beasley-Cockroft (Sr. Product Manager): This would be for the ape. It's intended to be…

194
00:16:22.020 --> 00:16:22.440
FQ - Lilith Chrakian: for the.

195
00:16:22.440 --> 00:16:28.129
Rebecca Beasley-Cockroft (Sr. Product Manager): Yeah, I mean, I think this is great of an area of improvement for us.

196
00:16:28.150 --> 00:16:34.899
FQ - Lilith Chrakian: Okay, just because it says start with sandbox, so I feel like what it says there means I should do that, so…

197
00:16:35.920 --> 00:16:37.570
FQ - Lilith Chrakian: Does that make sense? Okay.

198
00:16:37.780 --> 00:16:39.050
FQ Kristin Johnson: And that's helpful again.

199
00:16:39.050 --> 00:16:41.749
FQ - Lilith Chrakian: Okay, alright.

200
00:16:42.520 --> 00:16:50.479
FQ - Lilith Chrakian: Delivery method… header… header name is on that, file, like, the word file.

201
00:16:52.820 --> 00:16:56.149
FQ - Lilith Chrakian: It is… yeah, there, it's CPA.

202
00:16:56.690 --> 00:17:00.960
FQ Kristin Johnson: I'm actually not super familiar with this document either, okay?

203
00:17:02.080 --> 00:17:05.990
FQ - Lilith Chrakian: Okay, so what am I missing?

204
00:17:06.140 --> 00:17:14.760
FQ - Lilith Chrakian: Scroll up… Okay, display name… what… what am I con… like, what, is this.

205
00:17:14.760 --> 00:17:16.980
FQ Kristin Johnson: This is where it doesn't really matter, you can just make…

206
00:17:16.980 --> 00:17:23.070
FQ - Lilith Chrakian: Okay, okay, like, is this… this is just, like, a random API, it's not, like, an actual, like, system.

207
00:17:23.079 --> 00:17:23.609
FQ Kristin Johnson: Yep.

208
00:17:23.810 --> 00:17:26.230
FQ - Lilith Chrakian: Okay, so just, like, test random, yeah.

209
00:17:26.990 --> 00:17:28.210
FQ - Lilith Chrakian: There you go, okay.

210
00:17:28.329 --> 00:17:37.220
FQ - Lilith Chrakian: Health check URL, though, I don't know, and I don't know API version, but it doesn't look like it matters.

211
00:17:37.670 --> 00:17:38.390
FQ Kristin Johnson: Okay.

212
00:17:40.910 --> 00:17:42.399
FQ - Lilith Chrakian: But I'm stuck there.

213
00:17:42.800 --> 00:17:48.069
FQ Kristin Johnson: Why are you just check there? Oh, because you don't… so let's assume, let's assume you can move past the Health Check API.

214
00:17:49.770 --> 00:17:54.380
FQ - Lilith Chrakian: Yeah, so then I would click Test Connection, because I think I got everything.

215
00:17:54.560 --> 00:17:55.310
FQ Kristin Johnson: Okay.

216
00:17:58.020 --> 00:18:07.080
FQ - Lilith Chrakian: Okay, cool. Add each API endpoint. Okay, you'll configure. Okay, so this is where I add all the…

217
00:18:07.460 --> 00:18:14.110
FQ - Lilith Chrakian: general, ledger entries, all that. Okay, so endpoints, endpoint name, general ledger entries.

218
00:18:15.700 --> 00:18:17.679
FQ - Lilith Chrakian: From the other, yeah.

219
00:18:19.910 --> 00:18:21.949
FQ - Lilith Chrakian: So that's where I add the 4.

220
00:18:21.950 --> 00:18:23.509
FQ Kristin Johnson: Where am I… where am I getting it?

221
00:18:23.510 --> 00:18:27.999
FQ - Lilith Chrakian: Under, number 1, General Ledger Entries, just like the name for it.

222
00:18:28.000 --> 00:18:28.690
FQ Kristin Johnson: Okay.

223
00:18:29.770 --> 00:18:33.429
FQ - Lilith Chrakian: Would go into… Endpoint name.

224
00:18:33.830 --> 00:18:38.640
FQ - Lilith Chrakian: endpoint path, I assume that, yeah, that would be the get…

225
00:18:39.160 --> 00:18:42.760
FQ - Lilith Chrakian: Right under it, the V1 GL entries.

226
00:18:43.020 --> 00:18:45.159
FQ Kristin Johnson: No, what is it doing? That's weird.

227
00:18:48.540 --> 00:18:52.980
FQ - Lilith Chrakian: Retrieve posted journal entries within a range for a specific ledger.

228
00:18:54.140 --> 00:18:58.590
FQ - Lilith Chrakian: Type, can you click that drop-down, please?

229
00:18:58.590 --> 00:19:03.670
FQ Kristin Johnson: And I apologize, the label here should be, data refresh frequency.

230
00:19:03.670 --> 00:19:11.100
FQ - Lilith Chrakian: Oh, got it. Okay, I mean, I would do… Frequent, probably.

231
00:19:11.510 --> 00:19:12.110
FQ Kristin Johnson: Okay.

232
00:19:13.310 --> 00:19:13.840
FQ - Lilith Chrakian: Yeah.

233
00:19:14.620 --> 00:19:17.819
FQ - Lilith Chrakian: But I don't know what that means, like, what is frequent.

234
00:19:18.660 --> 00:19:19.340
FQ Kristin Johnson: Okay.

235
00:19:19.810 --> 00:19:20.360
FQ - Lilith Chrakian: Okay.

236
00:19:20.680 --> 00:19:30.479
FQ - Lilith Chrakian: Add… And then I would just add the other 4 in the same way.

237
00:19:30.710 --> 00:19:31.380
FQ Kristin Johnson: Okay.

238
00:19:31.380 --> 00:19:32.170
FQ - Lilith Chrakian: We can count it.

239
00:19:32.170 --> 00:19:36.449
FQ Kristin Johnson: Actually, let's… we'll do two. We don't need to go through all.

240
00:19:36.450 --> 00:19:36.830
FQ - Lilith Chrakian: Cool.

241
00:19:36.830 --> 00:19:39.620
FQ Kristin Johnson: Especially since you're not able to do the copy and paste.

242
00:19:39.620 --> 00:19:40.470
FQ - Lilith Chrakian: Okay.

243
00:19:40.620 --> 00:19:44.289
FQ Kristin Johnson: Whoops. Is that gonna copy?

244
00:19:49.610 --> 00:19:52.160
FQ Kristin Johnson: And we'll do that. We'll leave that one occasional. Okay.

245
00:19:52.160 --> 00:19:55.450
FQ - Lilith Chrakian: Okay. Okay. And then I would go to next.

246
00:19:56.890 --> 00:19:58.989
FQ - Lilith Chrakian: what you want to sync, okay.

247
00:19:59.940 --> 00:20:15.569
FQ - Lilith Chrakian: Okay, so general ledger entries… So, get… ingestion filter by… Date, sure.

248
00:20:16.600 --> 00:20:18.969
FQ Kristin Johnson: So you sound hesitant about that.

249
00:20:19.190 --> 00:20:27.600
FQ - Lilith Chrakian: I'm trying to absorb everything on this page. Okay, so data param… Oh, okay.

250
00:20:27.600 --> 00:20:30.439
FQ Kristin Johnson: Absorb everything on this page, what do you mean by that?

251
00:20:30.440 --> 00:20:39.590
FQ - Lilith Chrakian: just… Because… I'm trying to, like, match.

252
00:20:40.350 --> 00:20:45.049
FQ - Lilith Chrakian: like, see what I'm doing. So, like, for general ledger entries, I want…

253
00:20:45.390 --> 00:20:49.560
FQ - Lilith Chrakian: The entries within the range, so date from and date to.

254
00:20:49.800 --> 00:20:55.050
FQ - Lilith Chrakian: So, if I do data date from for the parameter.

255
00:20:56.260 --> 00:20:58.960
FQ - Lilith Chrakian: I'm curious if I can, like, add more.

256
00:20:59.970 --> 00:21:01.980
FQ - Lilith Chrakian: Right. Yeah.

257
00:21:03.200 --> 00:21:06.520
FQ - Lilith Chrakian: So, if it says date f… from…

258
00:21:07.210 --> 00:21:09.200
FQ - Lilith Chrakian: Why would you end it, though?

259
00:21:10.920 --> 00:21:17.420
FQ - Lilith Chrakian: Anyway, sorry. Okay, so a… So if you go back to the other tab.

260
00:21:17.980 --> 00:21:19.160
FQ Kristin Johnson: The document here?

261
00:21:19.160 --> 00:21:20.179
FQ - Lilith Chrakian: The document, yeah.

262
00:21:20.620 --> 00:21:21.900
FQ Kristin Johnson: Whoops, wrong one.

263
00:21:22.150 --> 00:21:26.339
FQ - Lilith Chrakian: I was gonna say, copy the date from for the parameter.

264
00:21:32.960 --> 00:21:34.090
FQ - Lilith Chrakian: Okay.

265
00:21:35.380 --> 00:21:42.250
FQ - Lilith Chrakian: Date… format… Can you click on that drop-down for date format?

266
00:21:42.510 --> 00:21:45.609
FQ - Lilith Chrakian: Month, month, day, day, year, year? Oh.

267
00:21:45.890 --> 00:21:49.040
FQ - Lilith Chrakian: I don't know what ISO 8601 is.

268
00:21:50.940 --> 00:21:51.650
FQ Kristin Johnson: Okay.

269
00:21:52.500 --> 00:21:55.920
FQ Kristin Johnson: So, do you… do you see in your document.

270
00:21:55.920 --> 00:21:58.850
FQ - Lilith Chrakian: Oh, international something something.

271
00:21:59.160 --> 00:22:00.820
FQ - Lilith Chrakian: Year, month, day.

272
00:22:01.750 --> 00:22:04.099
FQ - Lilith Chrakian: Yes, okay, so it would be that.

273
00:22:06.250 --> 00:22:09.019
FQ - Lilith Chrakian: I mean, is that a common thing I was supposed to know?

274
00:22:09.160 --> 00:22:25.479
FQ Kristin Johnson: And some of this is just, like, the prototype being weird, so it could very well be. So what… so when we're looking at this document, and you're… you're getting your… your… what are you looking at with respect to what you're determining for the date, in terms of the format?

275
00:22:27.030 --> 00:22:32.030
FQ - Lilith Chrakian: I was looking at the description.

276
00:22:32.370 --> 00:22:33.609
FQ Kristin Johnson: Right here, you're picking.

277
00:22:33.610 --> 00:22:34.900
FQ - Lilith Chrakian: The description, yeah, yeah, yeah.

278
00:22:34.900 --> 00:22:44.320
FQ Kristin Johnson: Okay, perfect. And so, and so let's assume, let's assume, again, because it's a prototype, and it's, it's, you know, it's a little hanky, you would have the, you know, there would be, like, other data.

279
00:22:44.320 --> 00:22:46.080
FQ - Lilith Chrakian: You're… okay, okay, okay.

280
00:22:46.080 --> 00:22:48.840
FQ Kristin Johnson: In the order in which, right? Like, year, year, month.

281
00:22:48.840 --> 00:22:49.810
FQ - Lilith Chrakian: Okay, okay.

282
00:22:49.970 --> 00:22:52.349
FQ Kristin Johnson: For the heck of it, we'll just pick this one for now.

283
00:22:52.350 --> 00:23:00.030
FQ - Lilith Chrakian: Okay, okay. And then response format… What's the drop-down for that?

284
00:23:16.330 --> 00:23:22.079
FQ - Lilith Chrakian: Oh, does that mean, like, when I… okay, I don't know, I would probably put CSV, I would assume?

285
00:23:22.620 --> 00:23:23.839
FQ Kristin Johnson: And, and why that choice?

286
00:23:24.000 --> 00:23:34.729
FQ - Lilith Chrakian: I don't know, because I… I assume that that's, like, how I would export the in… I don't know, but I feel like that's how I would export the information from…

287
00:23:34.930 --> 00:23:38.630
FQ - Lilith Chrakian: Flowcast afterwards is, like, in a CSV file.

288
00:23:39.160 --> 00:23:39.750
FQ Kristin Johnson: Okay.

289
00:23:40.720 --> 00:23:43.540
FQ - Lilith Chrakian: But I don't have…

290
00:23:44.270 --> 00:23:50.490
FQ - Lilith Chrakian: So that's date from, but then it says within a date range, so I don't know how to put date to.

291
00:23:50.860 --> 00:23:53.569
FQ - Lilith Chrakian: Can I test… can I click test endpoint?

292
00:23:53.570 --> 00:23:56.789
FQ Kristin Johnson: Yeah, and it's… I mean, it's gonna tell you it's… it passed, but…

293
00:23:56.790 --> 00:23:57.560
FQ - Lilith Chrakian: Oh, okay, okay.

294
00:23:57.560 --> 00:24:06.200
FQ Kristin Johnson: But there's, you know, there's… because it's not active. What the honest result right now would be it would fail. So let's say that you got a failure.

295
00:24:06.360 --> 00:24:07.240
FQ - Lilith Chrakian: Oh, okay.

296
00:24:09.060 --> 00:24:12.170
FQ - Lilith Chrakian: Well, then I don't know. Now I'm sad.

297
00:24:13.720 --> 00:24:17.900
FQ - Lilith Chrakian: Why would it be a fail?

298
00:24:18.200 --> 00:24:19.320
FQ - Lilith Chrakian: Can you tell me?

299
00:24:20.800 --> 00:24:21.390
FQ - Lilith Chrakian: Oh!

300
00:24:21.390 --> 00:24:23.760
FQ Kristin Johnson: Not all the information is in here.

301
00:24:23.760 --> 00:24:29.340
FQ - Lilith Chrakian: Okay, query… I see something for query… Params?

302
00:24:29.660 --> 00:24:31.290
FQ - Lilith Chrakian: Is that it? Yeah.

303
00:24:31.540 --> 00:24:32.200
FQ Kristin Johnson: Okay.

304
00:24:58.520 --> 00:24:59.880
FQ - Lilith Chrakian: I'm overwhelmed.

305
00:25:00.650 --> 00:25:05.150
FQ Kristin Johnson: Okay, that is… that is a fair assessment.

306
00:25:05.150 --> 00:25:05.820
FQ - Lilith Chrakian: Skk.

307
00:25:05.820 --> 00:25:12.670
FQ Kristin Johnson: Can you… can you do me a favor? Can you share your screen and show us your… your version of the document?

308
00:25:13.290 --> 00:25:19.100
FQ Kristin Johnson: And just kind of, you know, give us, like, how you're sort of parsing out what's on that document.

309
00:25:19.100 --> 00:25:20.329
FQ - Lilith Chrakian: like, what I think.

310
00:25:20.330 --> 00:25:21.399
FQ Kristin Johnson: Yeah, I'm like, where are you…

311
00:25:21.400 --> 00:25:21.920
FQ - Lilith Chrakian: doing.

312
00:25:21.920 --> 00:25:23.909
FQ Kristin Johnson: And all the things, yeah.

313
00:25:23.910 --> 00:25:26.180
FQ - Lilith Chrakian: Okay.

314
00:25:26.180 --> 00:25:28.570
FQ Kristin Johnson: Maybe you're sharing a different… there we go, perfect. Okay.

315
00:25:28.570 --> 00:25:29.290
FQ - Lilith Chrakian: Okay.

316
00:25:30.050 --> 00:25:34.970
FQ - Lilith Chrakian: So, I mean, I just assume this is, like, the main API.

317
00:25:35.080 --> 00:25:39.160
FQ - Lilith Chrakian: connection, right? And then, this is what I'm trying to, like.

318
00:25:40.660 --> 00:25:47.749
FQ - Lilith Chrakian: like, these are, like, the detailed, like, endpoints or whatever that I'm, trying to pull.

319
00:25:48.160 --> 00:25:50.700
FQ - Lilith Chrakian: from the API, right?

320
00:25:51.370 --> 00:25:59.570
FQ - Lilith Chrakian: So, like, detailed information. So, like, this would be, like, for the general ledger entries, I want to pull in

321
00:25:59.910 --> 00:26:05.960
FQ - Lilith Chrakian: like… The, like, retrieve the posted journal entries within this state.

322
00:26:07.940 --> 00:26:17.900
FQ - Lilith Chrakian: And then, like, same thing, like, accounts payable invoices, so I want to, like, be able to, in Flowcast, right, like, pull this information from the APA.

323
00:26:18.530 --> 00:26:23.999
FQ Kristin Johnson: So, one of the last things we were on, and I can, I can share again here quickly…

324
00:26:24.000 --> 00:26:24.540
FQ - Lilith Chrakian: Huh.

325
00:26:24.690 --> 00:26:27.370
FQ Kristin Johnson: Oh, can you, can you stop sharing? Or, oh, it's.

326
00:26:27.370 --> 00:26:27.980
FQ - Lilith Chrakian: Sorry, yes.

327
00:26:27.980 --> 00:26:42.309
FQ Kristin Johnson: Take it over, I'll just take it over. So one of the things that you did say, like, I… your last comment before you said you're overwhelmed, and I love that comment, thank you, that was brilliant. That's, like, one that we put in, like, big, like, here's user feedback.

328
00:26:43.400 --> 00:26:49.369
FQ Kristin Johnson: Design does not work. You, you were like, oh, I see something for a query param, so it seems.

329
00:26:49.370 --> 00:26:50.040
FQ - Lilith Chrakian: Yeah.

330
00:26:50.040 --> 00:27:00.420
FQ Kristin Johnson: point of, like, making an association between what you're seeing in the document with what was happening on the screen, but then… but then you hit a point where you're like, I don't know. So what was that trigger point?

331
00:27:00.420 --> 00:27:00.980
FQ - Lilith Chrakian: Oh.

332
00:27:01.360 --> 00:27:01.730
FQ - Lilith Chrakian: Okay.

333
00:27:01.730 --> 00:27:03.239
FQ Kristin Johnson: It fell apart for you.

334
00:27:03.240 --> 00:27:16.930
FQ - Lilith Chrakian: Because, like, the query params, like, that to me would be, like, being able to select, right? Like, the different, like, date from and date to, like, I thought that's where I would put that information in. However…

335
00:27:17.060 --> 00:27:23.569
FQ - Lilith Chrakian: because that's, like, the parameter, but then when I looked at the… the… Other screen, like the…

336
00:27:23.840 --> 00:27:28.760
FQ - Lilith Chrakian: options, it said key and value, and I don't know what that is.

337
00:27:28.890 --> 00:27:31.640
FQ Kristin Johnson: Okay, and is this… if this said parameter name…

338
00:27:31.640 --> 00:27:32.870
FQ - Lilith Chrakian: Yes.

339
00:27:32.870 --> 00:27:46.799
FQ Kristin Johnson: Okay, so in this case, it's just a labeling issue. So, so assuming, and again, prototype, assuming we had the name… the name right, it seemed like you were gonna… you were on the path of, like, oh, this is where I put the parameters in.

340
00:27:46.800 --> 00:27:49.019
FQ - Lilith Chrakian: Yeah, because I didn't know what key means.

341
00:27:49.380 --> 00:27:53.740
FQ Kristin Johnson: Yep, okay, got it. So that, that was a labeling fail. Okay, so you were…

342
00:27:53.740 --> 00:27:54.230
FQ - Lilith Chrakian: Okay.

343
00:27:54.560 --> 00:28:01.879
FQ - Lilith Chrakian: Is that… yeah, because I saw query, like, query… like, that's what we're… yeah, the parameters for, like, the query. That makes sense to me.

344
00:28:02.080 --> 00:28:05.209
FQ Kristin Johnson: So we would do that, and you would drop it in there.

345
00:28:05.210 --> 00:28:06.690
FQ - Lilith Chrakian: Okay, so that was it.

346
00:28:06.920 --> 00:28:12.859
FQ Kristin Johnson: Yeah, so then if we go back to… so we've got the parameter, then what would you do?

347
00:28:13.120 --> 00:28:17.799
FQ - Lilith Chrakian: Then, sorry, what was the other thing that it said on that page?

348
00:28:17.800 --> 00:28:20.120
FQ Kristin Johnson: I screwed this up, Rebecca, did you see that?

349
00:28:22.780 --> 00:28:23.550
Rebecca Beasley-Cockroft (Sr. Product Manager): I…

350
00:28:24.380 --> 00:28:24.910
FQ Kristin Johnson: So…

351
00:28:24.910 --> 00:28:28.129
Rebecca Beasley-Cockroft (Sr. Product Manager): Will it? You told me not to provide feedback.

352
00:28:28.130 --> 00:28:31.760
FQ Kristin Johnson: Oh, no, Lilith, it's the value, it's not the name.

353
00:28:31.760 --> 00:28:33.529
FQ - Lilith Chrakian: I see. Okay.

354
00:28:33.530 --> 00:28:39.320
FQ Kristin Johnson: This is where you get flexibility to say something, so my own prototype screwed me up. So yeah.

355
00:28:39.320 --> 00:28:39.720
FQ - Lilith Chrakian: Okay.

356
00:28:39.720 --> 00:28:45.350
FQ Kristin Johnson: keeping an eye on the time that we're getting… we're getting end of time. I see. I don't wanna… I don't wanna, like…

357
00:28:45.720 --> 00:28:48.600
FQ Kristin Johnson: extend your joyful experience.

358
00:28:48.740 --> 00:28:57.100
FQ Kristin Johnson: Could you… so one thing that would be helpful is… there's just a couple other questions I do want to ask you that are… that are repeats. Yeah.

359
00:28:57.540 --> 00:29:05.529
FQ Kristin Johnson: So… Having gone through the process, how technically challenging did you find it to be?

360
00:29:05.680 --> 00:29:07.970
FQ - Lilith Chrakian: With the way that it is today.

361
00:29:08.130 --> 00:29:09.909
FQ Kristin Johnson: With what you just walked through.

362
00:29:09.910 --> 00:29:10.590
FQ - Lilith Chrakian: A lack of…

363
00:29:10.590 --> 00:29:12.730
FQ Kristin Johnson: Document and that experience.

364
00:29:12.910 --> 00:29:14.940
FQ - Lilith Chrakian: like a 4.

365
00:29:14.940 --> 00:29:16.020
FQ Kristin Johnson: Okay, and 4 being on the.

366
00:29:16.020 --> 00:29:19.859
FQ - Lilith Chrakian: Only because, yeah, because I got stuck, and then it really overwhelmed me.

367
00:29:19.860 --> 00:29:25.790
FQ Kristin Johnson: Okay, and then, again, that effortful comment, like, 1 being not much effort at all, 5 being.

368
00:29:26.340 --> 00:29:27.159
FQ Kristin Johnson: a lot of effort.

369
00:29:27.180 --> 00:29:31.590
FQ - Lilith Chrakian: Okay, so looking at the document, yeah, I feel like if…

370
00:29:31.980 --> 00:29:39.389
FQ - Lilith Chrakian: the labels, and, like, it kind of made sense. It doesn't seem like it would be a lot of effort.

371
00:29:39.760 --> 00:29:43.870
FQ - Lilith Chrakian: But it was maybe, like, a 3.

372
00:29:44.280 --> 00:29:53.420
FQ Kristin Johnson: Okay, because you were… you were putting a… your comments, like, do you… do you feel that how you think about it isn't aligned with…

373
00:29:53.530 --> 00:30:00.730
FQ Kristin Johnson: the comments you were making along the way. And I recognize this was, like, your first time through, right? So maybe then at the second time through, you're like, oh yeah.

374
00:30:01.240 --> 00:30:03.230
FQ - Lilith Chrakian: Wait, say that again, sorry.

375
00:30:03.230 --> 00:30:14.759
FQ Kristin Johnson: So, just the comments that you were making along the way as you were… as you were putting it together… Yeah. It sounded like there was a lot more effort, like, you know, the brain processing all the things that you were having to do to figure things out.

376
00:30:14.760 --> 00:30:26.310
FQ - Lilith Chrakian: Yeah, because it was, like, the first time doing it, whereas, like, I feel like the next time, I would have more… I don't know, it just takes me a while to, like, understand what it is I'm doing, right? Like, yeah.

377
00:30:26.310 --> 00:30:28.949
FQ Kristin Johnson: You get that first context, and you're like, oh yeah, now I know what I'm doing.

378
00:30:28.950 --> 00:30:29.640
FQ - Lilith Chrakian: Now I know.

379
00:30:29.640 --> 00:30:35.739
FQ Kristin Johnson: Now I can do it faster. Yeah. Do you have a couple more minutes to go longer, because we have a few more questions?

380
00:30:35.740 --> 00:30:40.869
FQ - Lilith Chrakian: I do, I just have an internal meeting, so all I have to do is just…

381
00:30:41.500 --> 00:30:44.299
FQ - Lilith Chrakian: message Megan real quick.

382
00:30:44.310 --> 00:30:46.650
FQ Kristin Johnson: Let me make sure… yeah, I'm good too.

383
00:30:48.330 --> 00:30:52.259
FQ Kristin Johnson: And then, Natasha, I know you had added some additional questions. Do you want to pick those up?

384
00:30:53.990 --> 00:31:00.910
FQ - Natasha Clark: Yeah, let me bring up his documents…

385
00:31:02.070 --> 00:31:10.370
FQ - Natasha Clark: I guess, just from my own context, do you do anything around setting up APIs at the moment? I know you said you kind of have some familiarity with the terminology, but…

386
00:31:10.370 --> 00:31:26.790
FQ - Lilith Chrakian: I understand the terminology, and, like, the only… like, I've had experience, like, on the finance team, basically, like, running queries for, like, our… from Salesforce into, like, our commission software, so, like, it's not completely…

387
00:31:26.990 --> 00:31:35.029
FQ - Lilith Chrakian: new to me. And then, like, the only other thing I do is, like, I've set up, like, SFDC for, like, our clients, but…

388
00:31:35.320 --> 00:31:40.200
FQ - Lilith Chrakian: not API. Like, I haven't done, like, an API integration before.

389
00:31:41.130 --> 00:31:42.770
FQ - Natasha Clark: Okay, stop.

390
00:31:42.770 --> 00:31:43.910
FQ - Lilith Chrakian: I mean, other than… yeah.

391
00:31:43.910 --> 00:31:52.670
FQ - Natasha Clark: Yeah, first question. I guess… so I have two questions, and they're gonna sound like the same question, but they're, like, slightly different flavors of each other.

392
00:31:52.830 --> 00:32:01.299
FQ - Natasha Clark: Do you feel like there was anything missing from that experience that would have, like, made it a better experience for you?

393
00:32:01.550 --> 00:32:05.600
FQ - Natasha Clark: Like, within the UI itself, like, not necessarily thinking about the document.

394
00:32:07.750 --> 00:32:09.740
FQ Kristin Johnson: I can share again if that makes it helpful to actually.

395
00:32:09.740 --> 00:32:10.290
FQ - Lilith Chrakian: Yeah.

396
00:32:10.520 --> 00:32:17.150
FQ Kristin Johnson: Okay, I'll make it back here… Oh, go ahead.

397
00:32:22.790 --> 00:32:23.490
FQ Kristin Johnson: Okay.

398
00:32:26.010 --> 00:32:38.800
FQ - Lilith Chrakian: Yeah, I feel like… I don't know if this makes sense, but, like, maybe more context. Or, like…

399
00:32:39.330 --> 00:32:41.879
FQ - Lilith Chrakian: Can we go to the other.

400
00:32:42.490 --> 00:32:43.549
FQ Kristin Johnson: To the setup screen?

401
00:32:43.550 --> 00:32:44.829
FQ - Lilith Chrakian: To, to the… yeah.

402
00:32:49.690 --> 00:32:50.890
FQ Kristin Johnson: Is this the screen you meant?

403
00:32:50.890 --> 00:33:07.719
FQ - Lilith Chrakian: Yeah, I mean, not really. Oh, I guess, like, when you're pulling in, like, the parameters or whatever, like, could there be, like, something that you run that you then see, like, examples of, like, oh, is this pulling in properly? Does that make sense?

404
00:33:08.050 --> 00:33:11.120
FQ Kristin Johnson: So, if we talk about the parameters, are you talking about.

405
00:33:11.120 --> 00:33:12.330
FQ - Lilith Chrakian: like GL.

406
00:33:12.940 --> 00:33:16.690
FQ - Lilith Chrakian: Yeah. Like, for, like, the GL… yeah, that page.

407
00:33:16.690 --> 00:33:17.240
FQ Kristin Johnson: Okay.

408
00:33:17.240 --> 00:33:24.789
FQ - Lilith Chrakian: Like, when you click test endpoint, and it just doesn't say success, but it actually shows you, like, what's pulling in, does that make sense?

409
00:33:25.170 --> 00:33:26.589
FQ Kristin Johnson: Yeah, so you're getting sample data, essentially.

410
00:33:26.590 --> 00:33:28.129
FQ - Lilith Chrakian: Like, sample data, yeah.

411
00:33:30.280 --> 00:33:30.880
FQ Kristin Johnson: And…

412
00:33:31.340 --> 00:33:37.610
FQ Kristin Johnson: So, how would that have helped you at the center? What are you looking for that? What are you looking for there?

413
00:33:37.830 --> 00:33:45.840
FQ - Lilith Chrakian: To make sure that, like, what I, like, I'm getting… like, it's actually pulling it in in, like, the correct format that I'm expecting.

414
00:33:46.060 --> 00:33:50.080
FQ Kristin Johnson: So you're able to see the data and be like, oh, that's not the data I was looking for.

415
00:33:50.080 --> 00:33:50.700
FQ - Lilith Chrakian: Yeah.

416
00:33:50.700 --> 00:33:55.280
FQ Kristin Johnson: do date from. Then you can see, like, oh, like, no, date from should be this.

417
00:33:55.500 --> 00:33:56.190
FQ - Lilith Chrakian: Yeah.

418
00:33:59.170 --> 00:34:09.580
FQ - Lilith Chrakian: Also, I feel like just having those 3 tabs at the top, like, it wasn't clear that I needed to finish that before I hit continue.

419
00:34:13.370 --> 00:34:14.170
FQ Kristin Johnson: Okay.

420
00:34:14.440 --> 00:34:17.490
FQ - Lilith Chrakian: Because those just look like optional. I don't know.

421
00:34:18.310 --> 00:34:19.879
FQ - Lilith Chrakian: I actually didn't even know they were taps.

422
00:34:20.270 --> 00:34:23.939
FQ - Lilith Chrakian: Until it… until you said it was gonna fail, and then you said that all.

423
00:34:23.949 --> 00:34:24.589
FQ Kristin Johnson: If you don't.

424
00:34:24.590 --> 00:34:26.770
FQ - Lilith Chrakian: It wasn't… wasn't, like, completed.

425
00:34:32.120 --> 00:34:32.820
FQ - Lilith Chrakian: Yeah.

426
00:34:33.320 --> 00:34:34.939
FQ - Lilith Chrakian: Am I being helpful?

427
00:34:35.159 --> 00:34:35.699
FQ Kristin Johnson: Absolutely.

428
00:34:35.699 --> 00:34:37.499
FQ - Natasha Clark: Absolutely, yeah. I cannot.

429
00:34:37.500 --> 00:34:43.900
FQ Alex Kearns: tell you how helpful this is for us. Oh, you're 100%, like, helping us to make.

430
00:34:43.909 --> 00:34:44.309
FQ Kristin Johnson: Questions.

431
00:34:44.310 --> 00:34:45.800
FQ Alex Kearns: A better product.

432
00:34:45.800 --> 00:34:48.460
FQ Kristin Johnson: Are you willing to have another meeting with…

433
00:34:48.460 --> 00:34:52.209
FQ - Lilith Chrakian: Honestly, I actually… I would, yes, yeah.

434
00:34:52.219 --> 00:34:52.779
FQ Kristin Johnson: Yeah.

435
00:34:53.030 --> 00:34:54.869
FQ Kristin Johnson: For sure.

436
00:34:54.870 --> 00:34:59.259
FQ - Lilith Chrakian: to go into more… to do the rest of it, like, now I actually want to do it.

437
00:35:00.260 --> 00:35:01.620
FQ - Lilith Chrakian: And have it work.

438
00:35:02.060 --> 00:35:03.020
FQ - Lilith Chrakian: Yeah.

439
00:35:03.020 --> 00:35:10.649
FQ Kristin Johnson: I have high confidence that you, like, once you went through it, there would be like, oh, yeah. But, so, Natasha, it sounded like you had another one, another follow-up?

440
00:35:10.950 --> 00:35:13.770
FQ - Natasha Clark: Yeah, and like I said, it's, it's like a…

441
00:35:15.560 --> 00:35:19.070
FQ - Natasha Clark: It's like, it's like a similar flavor to that question, but, like, what…

442
00:35:19.620 --> 00:35:25.989
FQ - Natasha Clark: what was… what about this was, like, the most frustrating? And it doesn't… that doesn't necessarily have to be, like.

443
00:35:26.580 --> 00:35:31.080
FQ - Natasha Clark: the specific… a specific piece of the screen, although it could be, but, like, I guess…

444
00:35:32.270 --> 00:35:37.519
FQ - Natasha Clark: similar to what, Kristen was asking you earlier, when you hit that point of frustration, like, what…

445
00:35:37.850 --> 00:35:41.110
FQ - Natasha Clark: was the most… Like, what we.

446
00:35:41.110 --> 00:35:41.949
FQ - Lilith Chrakian: Oh, I see.

447
00:35:41.950 --> 00:35:42.469
FQ - Natasha Clark: Seal that front.

448
00:35:42.470 --> 00:35:58.749
FQ - Lilith Chrakian: Okay, it was because, like, what I was trying to… like, the information that I had didn't feel like it matched what was on… like, it just… it got to be overwhelming, because I'm like, oh, I don't know what some of this stuff means.

449
00:36:02.850 --> 00:36:14.640
FQ - Lilith Chrakian: it just seemed like there was too much information I had to fill out here that maybe I didn't have the answers to and didn't understand, like, the context for. Because when I'm looking at this file, like, the…

450
00:36:14.810 --> 00:36:25.379
FQ - Lilith Chrakian: Word file, I can see what that stuff kind of means, like, overall. But here, in, like, the…

451
00:36:25.630 --> 00:36:29.460
FQ - Lilith Chrakian: whatever I'm filling out, I'm not…

452
00:36:30.110 --> 00:36:32.110
FQ - Lilith Chrakian: It didn't line up with it.

453
00:36:37.500 --> 00:36:46.030
FQ - Lilith Chrakian: Like, I don't know what I… sorry. Like, I don't know what I was doing on this tab, like the request details tab, and then to go to the query

454
00:36:48.990 --> 00:36:49.770
FQ - Lilith Chrakian: like…

455
00:36:49.950 --> 00:36:58.620
FQ - Lilith Chrakian: Does that make sense? Like, why is there a date parameter there, and then on the query pad, like, I would expect that to be on the other tab.

456
00:36:59.430 --> 00:37:01.640
FQ - Lilith Chrakian: So I don't know exactly what I filled out.

457
00:37:02.190 --> 00:37:06.969
FQ Kristin Johnson: Okay, and some of this may be labeling, too. I'll follow up with Rebecca after.

458
00:37:06.970 --> 00:37:08.590
FQ - Lilith Chrakian: Which I think is the most important.

459
00:37:09.120 --> 00:37:11.030
FQ - Lilith Chrakian: is the labeling.

460
00:37:16.510 --> 00:37:20.689
FQ Kristin Johnson: And just so you'd get to see it. You didn't get to see this tab.

461
00:37:20.880 --> 00:37:22.150
FQ - Lilith Chrakian: It's… oh.

462
00:37:24.080 --> 00:37:29.540
FQ - Lilith Chrakian: Yeah, I feel like, can… can there be… like, it's too technical, this…

463
00:37:30.200 --> 00:37:34.930
FQ - Lilith Chrakian: thing. Like, could there be context of, like, what we're doing? Like, would that make sense?

464
00:37:35.880 --> 00:37:37.100
FQ Kristin Johnson: Can you give me an example?

465
00:37:37.160 --> 00:37:41.319
FQ - Lilith Chrakian: Yeah, like, what does sync mode mean?

466
00:37:44.870 --> 00:37:48.219
FQ Kristin Johnson: So in this case, it would be how frequently the system is… is…

467
00:37:49.050 --> 00:37:52.389
FQ Kristin Johnson: pulling data in. I mean, Rebecca, jump in on that one.

468
00:37:52.620 --> 00:37:56.920
FQ Alex Kearns: She's gone, should have jumped to another meeting, but yeah, it would be, like.

469
00:37:57.040 --> 00:38:12.949
FQ Alex Kearns: how often should we be, trying to pull data from their system? So, one of the things that's, like, interesting with connecting to somebody else's system is it's, like, the same thing if I were to say, like, hey, how many times do you mind if I, like, you know.

470
00:38:13.030 --> 00:38:24.320
FQ Alex Kearns: send you an email is probably, like, the wrong way to phrase it, but kind of similar, right? Where, like, how often should we be hitting your system? Sometimes you're gonna cause somebody to experience issues there, if you hit too frequently.

471
00:38:24.320 --> 00:38:25.670
FQ - Lilith Chrakian: Versus… Okay.

472
00:38:26.630 --> 00:38:34.440
FQ Alex Kearns: Or maybe not, maybe sync mode is actually… has more to do with…

473
00:38:34.440 --> 00:38:35.649
FQ Kristin Johnson: Yeah, how it… whether…

474
00:38:37.340 --> 00:38:43.140
FQ Alex Kearns: Yeah. So, sync frequency has to do with how often are you doing that pull.

475
00:38:43.140 --> 00:38:44.750
FQ - Lilith Chrakian: That… yeah, that makes sense.

476
00:38:44.750 --> 00:38:57.420
FQ Alex Kearns: incremental versus full refresh is, do we pass you, like, a date or something to be able to pull, like, sort of, like, a change or delta of data versus the whole world? So…

477
00:38:57.460 --> 00:39:04.950
FQ Alex Kearns: Most of the time, you would probably want to do something like incremental, but that might not make sense for, say, like.

478
00:39:05.040 --> 00:39:07.450
FQ Alex Kearns: chart of accounts, right? Like.

479
00:39:08.230 --> 00:39:08.570
FQ - Lilith Chrakian: Yeah.

480
00:39:08.570 --> 00:39:13.889
FQ Alex Kearns: of, like, you probably want the full chart of accounts every time, versus, say, like.

481
00:39:14.150 --> 00:39:18.289
FQ Alex Kearns: Balances, you might only want balances as of a point in time.

482
00:39:19.410 --> 00:39:22.350
FQ - Lilith Chrakian: Yeah… Okay.

483
00:39:32.950 --> 00:39:35.780
FQ - Lilith Chrakian: But, like, I feel like that's not clear.

484
00:39:36.320 --> 00:39:40.409
FQ - Lilith Chrakian: in that, right? Like, that's not clear, that… what I'm selecting.

485
00:39:40.780 --> 00:39:51.039
FQ - Lilith Chrakian: And then I might, like, what if I'm a client? I don't know, I'm just thinking, and I didn't click full refresh, but then I should have, or whatever. And I'm like, oh, well, Flowcast doesn't do this, or whatever.

486
00:39:52.280 --> 00:39:53.239
FQ - Lilith Chrakian: I don't know.

487
00:39:55.780 --> 00:40:03.740
FQ Alex Kearns: Yeah, I think that's exactly right, in terms of, like, the question to ask and the things to tell us that are not clear, because, you know, to your

488
00:40:04.040 --> 00:40:07.819
FQ Alex Kearns: point, right? Like, we don't want… our customers…

489
00:40:08.130 --> 00:40:08.989
FQ Kristin Johnson: To have you.

490
00:40:08.990 --> 00:40:10.160
FQ Alex Kearns: You have the wrong…

491
00:40:10.160 --> 00:40:10.860
FQ Kristin Johnson: Have them.

492
00:40:10.860 --> 00:40:14.619
FQ Alex Kearns: The wrong setup and not know… what they're doing.

493
00:40:14.620 --> 00:40:14.980
FQ - Lilith Chrakian: Yeah.

494
00:40:15.660 --> 00:40:16.360
FQ Alex Kearns: So…

495
00:40:16.360 --> 00:40:17.000
FQ - Lilith Chrakian: Yeah.

496
00:40:17.330 --> 00:40:25.969
FQ - Lilith Chrakian: Yeah, like, sync mode confuses me. Obviously, sync frequency makes sense, like, that's… Yeah.

497
00:40:29.800 --> 00:40:31.830
FQ Kristin Johnson: Natasha, was there more that you had?

498
00:40:35.370 --> 00:40:49.369
FQ - Natasha Clark: I did think of, like, one other hopefully tiny question. So you, you got frustrated and you sort of felt like you didn't know what to do next. I guess in your scenario, who would you bring in?

499
00:40:49.500 --> 00:40:56.519
FQ - Natasha Clark: To help you figure out the rest of the process, if you really felt like you couldn't just figure it out.

500
00:40:56.990 --> 00:40:59.080
FQ - Lilith Chrakian: Our support team.

501
00:41:00.240 --> 00:41:01.460
FQ Alex Kearns: Is that Jason's team?

502
00:41:01.460 --> 00:41:07.379
FQ - Lilith Chrakian: Yeah, like, the how-to integrations, yeah. Like, I would post in that Slack.

503
00:41:08.610 --> 00:41:10.509
FQ - Lilith Chrakian: We have, like, a Slack channel.

504
00:41:16.230 --> 00:41:18.730
FQ Kristin Johnson: And then, Alex, did you have any follow-ups?

505
00:41:20.360 --> 00:41:33.449
FQ Alex Kearns: No, just wanted to say again, thank you so much. I know it's probably a little intimidating to have us, watch you, but it… I think as, you know, Kristen mentioned kind of at the beginning, it's really not about, like.

506
00:41:33.790 --> 00:41:47.360
FQ Alex Kearns: a test or a quiz for you. It's just that, like, we've spent a little too much time probably looking at these, right? And so, it's so helpful to have someone have, like, a fresh set of eyes, and especially someone who

507
00:41:47.360 --> 00:41:55.180
FQ Alex Kearns: works with our customers that can say, like, this is gonna be confusing for our customers, right? Like, we might have some feelings about it.

508
00:41:55.960 --> 00:41:59.820
FQ Alex Kearns: hearing that is just so useful. I think that's the very best

509
00:42:00.010 --> 00:42:06.810
FQ Alex Kearns: You know, really gift, to give our team in terms of product and designers, so just really appreciate you.

510
00:42:07.020 --> 00:42:26.189
FQ - Lilith Chrakian: Yeah, of course. I'm glad I could help. I also was wondering, because we do pull in, like, the IT team, like, the customer's IT team, anytime we're working on, like, the APIs or SFTP integrations, like, does it make more sense for it to be someone at that level that does this, or…

511
00:42:26.980 --> 00:42:27.870
FQ - Lilith Chrakian: not.

512
00:42:28.030 --> 00:42:31.209
FQ - Lilith Chrakian: Because, like, we do require IT involvement.

513
00:42:32.280 --> 00:42:34.389
FQ - Lilith Chrakian: I'm sure you guys vetted, you know.

514
00:42:34.680 --> 00:42:36.040
FQ - Lilith Chrakian: That out, but…

515
00:42:36.610 --> 00:42:47.719
FQ Alex Kearns: Yeah, I think that's a great question. I think we've struggled a little bit with some of that, because I think on, like, a technical side, an SFTP and, like, who sets that up, I think,

516
00:42:47.980 --> 00:42:52.689
FQ Alex Kearns: sometimes if our clients have a document like that, they would like to… I mean, my.

517
00:42:53.050 --> 00:43:08.410
FQ Alex Kearns: is they'd like to be able to do that themselves. Yeah. Right? And if you could tell a client, hey, if you already have API documentation, you don't need your IT team. You can just get started, right? Like, I think that's the direction, as a team, we'd love to be able to go.

518
00:43:08.410 --> 00:43:14.450
FQ Alex Kearns: Now, to your point, maybe we end up in a state where, you know, we run through this with…

519
00:43:14.450 --> 00:43:17.349
FQ Alex Kearns: You know, different people, and we end up finding, like.

520
00:43:17.350 --> 00:43:35.029
FQ Alex Kearns: even though that's a goal of ours, it maybe doesn't quite fit, but I think that would be the ideal, is that somebody could have the documentation, which often their tech team kind of already has, and they can just fill things out. That would be awesome. I don't know, you know, Kristen, Natasha, if you kind of agree with that.

521
00:43:36.330 --> 00:43:48.150
FQ Kristin Johnson: Well, and I know Rebecca's actually had the idea, Lilith, of when you go… when you go back to that first… let's go back here… Before you're even, you know, before you're even connecting, and, you know.

522
00:43:48.320 --> 00:43:52.790
FQ Kristin Johnson: Once we get you through that, choosing out which connector flow you want.

523
00:43:52.790 --> 00:44:13.480
FQ Kristin Johnson: You disable that document I gave you, you upload it, right? And the system just consumes it, and knows where to put everything, and then it's like, does this look right? But the problem there, like, fine, we can even do that. The problem there is, to your point, the labeling isn't clear, like, sync mode. Nobody, nobody knows, right? So then having that very non-technical, user-oriented…

524
00:44:13.480 --> 00:44:17.429
FQ Kristin Johnson: Which is, like, when we pull data, should we be pulling everything or only the data?

525
00:44:18.100 --> 00:44:29.060
FQ - Lilith Chrakian: Yeah, I like that in terms of if you were to do something like that, and then having a summary that explains that, like a before-you-confirm, you know, sync mode, like.

526
00:44:29.060 --> 00:44:38.989
FQ - Lilith Chrakian: explanation, however that looks, I don't know, like, I don't know these things, but, like, however that looks, so that I understand, like, what I'm agreeing to before I click, like, finish.

527
00:44:39.020 --> 00:44:40.509
FQ - Lilith Chrakian: It's like, oh, that…

528
00:44:40.570 --> 00:44:49.560
FQ - Lilith Chrakian: looks right to me. That's how often it's refreshing, and then the data that it's… the period that it's pulling, and then,

529
00:44:49.870 --> 00:44:56.449
FQ - Lilith Chrakian: what's, what was I gonna say? Oh yeah, and then, like, if it's incremental, like, what that means.

530
00:44:57.860 --> 00:45:02.549
FQ - Lilith Chrakian: I think that would be helpful as…

531
00:45:02.830 --> 00:45:12.370
FQ - Lilith Chrakian: a person, but then I'm also thinking, sorry, if you train, like, our team, for example, to walk a client through this, like, we could, right?

532
00:45:12.580 --> 00:45:22.870
FQ - Lilith Chrakian: But… Yeah, like, I understand what you're saying with, like, not having the IT team involvement.

533
00:45:23.070 --> 00:45:23.709
FQ - Lilith Chrakian: Yeah, in my…

534
00:45:23.710 --> 00:45:35.360
FQ Kristin Johnson: training is a dirty word. Like, there's… there is no training. You're gonna… no, seriously, you're gonna show this to a customer, they're gonna flush it, and they're gonna come back in three months and be like, can you walk me through that again? Like, it's an unending cycle, because, like, they have things to do, you know what I mean.

535
00:45:35.360 --> 00:45:41.820
FQ - Lilith Chrakian: Oh, yeah, yeah, yeah, like, we would walk them through it, like, exactly, to set it up initially.

536
00:45:41.820 --> 00:45:45.790
FQ Kristin Johnson: But they'll never be able to do again. They'll keep coming back to you. That's the reality. Yeah.

537
00:45:46.010 --> 00:45:46.889
FQ - Lilith Chrakian: But are they gonna…

538
00:45:46.890 --> 00:45:54.400
FQ Kristin Johnson: So we need to bring that threshold down to the point where they're not having to constantly ping you, where they do have the confidence to be like, oh, I know exactly what they're asking for.

539
00:45:54.400 --> 00:45:55.550
FQ - Lilith Chrakian: Yeah, yeah.

540
00:45:56.970 --> 00:46:12.270
FQ Alex Kearns: Sometimes they would need to go back in, because sometimes people change authentication, like, they rotate stuff the same way we have to reset our passwords, right? So, like, potentially they could… they would have to come back in occasionally for that, maybe they…

541
00:46:12.270 --> 00:46:29.979
FQ Alex Kearns: they have some new data point they really want to use and, say, transform, right? They have, like, a new API endpoint of data set available that wasn't available previously. They want to go back in, and they want to add that data set in. So those would be some scenarios I would think of where it'd be really useful for them.

542
00:46:30.080 --> 00:46:31.590
FQ Alex Kearns: To be able to go back in.

543
00:46:31.900 --> 00:46:34.420
FQ Alex Kearns: I don't think they'd be doing it every day.

544
00:46:34.710 --> 00:46:35.050
FQ - Lilith Chrakian: Yeah.

545
00:46:35.050 --> 00:46:42.530
FQ Alex Kearns: I don't know about our integration part… like, about our partners, like, in that type of persona either, but that would be something else to think about.

546
00:46:43.360 --> 00:46:53.059
FQ - Lilith Chrakian: And where does this, like, workbook with the connection details… I mean, the sheet with that… where does that come from? I know it says prepared by IT, but…

547
00:46:54.050 --> 00:46:57.300
FQ - Lilith Chrakian: Is that, like, the company's IT team preparing that?

548
00:46:57.420 --> 00:46:57.920
FQ - Lilith Chrakian: like this.

549
00:46:57.920 --> 00:47:12.790
FQ Alex Kearns: It depends, so it might be that it's, like, that company's IT team. So, Flowcast has our own external APIs, and our engineering team has prepared API documentation

550
00:47:12.790 --> 00:47:30.209
FQ Alex Kearns: for our customers, if they want to post stuff to our APIs, kind of the same idea. So if they have stuff kind of, like, housed in their system, they might have their own APIs that they, like, maintain and manage, and then so their engineering and IT teams are kind of responsible for generating this.

551
00:47:30.210 --> 00:47:34.419
FQ Alex Kearns: But sometimes they might be using another system.

552
00:47:34.470 --> 00:47:46.779
FQ Alex Kearns: right, like, an installed system, and that's the API that you'd use, and so maybe they'd make slight modifications, or it might just be, like, a pass-through. I don't know, Kristin and Natasha, if you'd say anything different, but that's how I think about it.

553
00:47:47.770 --> 00:47:50.220
FQ Kristin Johnson: I would defer to you, Alex, in terms of how they…

554
00:47:50.220 --> 00:47:52.800
FQ - Natasha Clark: I don't have… I don't have a ton of knowledge on that.

555
00:47:52.950 --> 00:48:00.159
FQ Kristin Johnson: Yeah, and the other challenge that we have, Lilith, is that there's no… there's no guaranteed continuity in terms of how that document's put together, either.

556
00:48:00.550 --> 00:48:01.080
FQ Kristin Johnson: Thank you.

557
00:48:01.080 --> 00:48:01.630
FQ - Lilith Chrakian: why I…

558
00:48:01.890 --> 00:48:13.379
FQ Kristin Johnson: Yeah, make it look like the form. That's so… like, because I totally, like, align with that, but the problem is, right, if someone else is like, oh, well, we've structured it this way. So that's just.

559
00:48:13.380 --> 00:48:13.950
FQ - Lilith Chrakian: Yeah.

560
00:48:13.950 --> 00:48:14.615
FQ Kristin Johnson: But…

561
00:48:15.280 --> 00:48:16.580
FQ - Lilith Chrakian: Yeah, yeah.

562
00:48:16.810 --> 00:48:17.730
FQ - Lilith Chrakian: Okay.

563
00:48:19.460 --> 00:48:27.820
FQ Kristin Johnson: All right. Well, thank you again. I hope you walk away from this not feeling like you are, you know, subjected to any judgment whatsoever.

564
00:48:28.900 --> 00:48:32.930
FQ Kristin Johnson: I really helped them, because absolutely, like Alex said, you really, really helped us.

565
00:48:32.930 --> 00:48:35.860
FQ - Lilith Chrakian: Okay, cool, cool. Well, let me know, yeah.

566
00:48:35.860 --> 00:48:42.189
FQ Kristin Johnson: Yeah, and then, Victor and Kara are gonna go through it tomorrow, so you can chat about how that was.

567
00:48:42.420 --> 00:48:45.500
FQ - Lilith Chrakian: Yeah, yeah, yeah, for sure, for sure. Okay, thank you guys.

568
00:48:45.500 --> 00:48:45.880
FQ Kristin Johnson: Thank you so much.

569
00:48:45.880 --> 00:48:47.979
FQ Alex Kearns: Thank you so much. Talk to you later.

570
00:48:47.980 --> 00:48:48.580
FQ - Lilith Chrakian: way.

