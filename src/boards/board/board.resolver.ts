import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { CreateBoardInput } from './dtos/create-board.dto';
import {
  GetBoardListFilter,
  GetBoardListOutput,
} from './dtos/get-board-list.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User } from '../../auth/entities/user.entitiy';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';
import { IGraphQLContext } from '../../types/graphql.types';

@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => GetBoardListOutput)
  getBoardList(
    @Args('filter', { nullable: true }) getBoardListFilter: GetBoardListFilter,
  ): Promise<GetBoardListOutput> {
    return this.boardService.getBoardList(getBoardListFilter);
  }

  @Query(() => Board)
  getBoard(@Args('boardId') boardId: string): Promise<Board> {
    return this.boardService.getBoard(boardId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('input') createBoardInput: CreateBoardInput,
    @CurrentUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Board)
  updateBoard(
    @Args('input') updateBoardInput: UpdateBoardInput,
    @CurrentUser() user: User,
  ) {
    return this.boardService.updateBoard(updateBoardInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  deleteBoard(
    @Args() deleteBoardArgs: DeleteBoardArgs,
    @CurrentUser() user: User,
  ) {
    return this.boardService.deleteBoard(deleteBoardArgs, user);
  }

  @ResolveProperty('user')
  async user(@Root() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(board.userId);
  }

  @ResolveProperty('likes')
  async likes(@Root() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardLikeLoader.load(board.id);
  }

  @ResolveProperty('comments')
  async comments(@Root() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardCommentLoader.load(board.id);
  }
}